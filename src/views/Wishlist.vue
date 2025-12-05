<template>
    <div>
        <section class="container my-5">
            <h2 class="text-center text-secondary-ml animate__animated animate__fadeIn">WishList</h2>
            <ul class="list-group" v-if="libros.length > 0">
                <li class="list-group-item animate__animated animate__zoomIn" v-for="(libro, index) in libros" :key="index">
                    <div class="row g-0">
                        <div class="col-2 col-lg-1">
                            <img
                                v-if="libro.cover_i"
                                :src="libro.portada  || `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`"
                                :alt="`Portada de '${libro.title }' de ${libro.author_name[0] }`"
                                class="card-img-top"
                                Style="height: auto; object-fit: cover;"
                            />
                        </div>
                        <div class="col-10 col-lg-11">
                            <div class="ms-4 card-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <h3 class="card-title">{{ libro.title }}</h3>
                                    </div>
                                    <div class="col-md-4" Style="text-align: end">
                                        <agregar-quitar-btn :libro="libro" @actualizado="acutalizar"></agregar-quitar-btn> 
                                        <button class="btn btn-blue ms-2" @click="abrirModal(libro)">
                                            Editar
                                        </button>
                                    </div>
                                </div>
                                <p class="card-text">
                                    <template v-for="(author, a) in libro.author_name" :key="a">
                                        <span>{{ author }}</span>
                                        <span v-if="a < (libro.author_name.length - 1)">, </span>
                                        <span v-else>.</span>
                                    </template>
                                </p>
                                <small class="text-muted">{{ libro.first_publish_year }}</small>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-else class="text-center">
                <p>No hay libros en tu wishlist. Agrega algunos para empezar.</p>
                <router-link to="/libros" class="btn btn-blue mx-2">Ver Librería</router-link>
            </div>
        </section>
        <section class="container text-center my-5">
            <h2 class="text-secondary-ml animate__backInUp">Agregar un libro nuevo</h2>
            <p>
                Completa el siguiente formulario para agregar un nuevo libro que no esté en la librería a tu lista de deseos.
                <br>
                Si el libro ya está en la librería, puedes agregarlo directamente desde allí.
            </p>
            <p>
                <em>
                    <strong>Nota:</strong> Supongamos, solo supongamos, que el usuario podria hacer esto.
                </em>
            </p>
            <div class="my-5">
                <button class="btn btn-blue mb-3" @click="abrirModal()">Agregar libro nuevo</button>
            </div>
            <cargar-libro :mostrar="mostrarModal" @close="cerrarModal" :libro="libroSeleccionado"/>
        </section> 
        <section class="container my-5">
            <h2 class="text-center text-secondary-ml animate__animated animate__fadeIn">Libros en Base de Datos</h2>
            <table class="table table-striped table-hover" v-if="librosDB.length">
                <thead>
                    <tr>
                        <th>Portada</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Año</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="libro in librosDB" :key="libro.id">
                        <td>
                        <img
                            :src="libro.portada || 'https://images.cdn1.buscalibre.com/fit-in/360x360/dd/cc/ddcc709d0fa44d35e9c9497003926e42.jpg'"
                            alt="Portada"
                            style="height: 90px; object-fit: cover;"
                        />
                        </td>
                        <td>{{ libro.title }}</td>
                        <td>{{ libro.author }}</td>
                        <td>{{ libro.first_publish_year || 'Desconocido' }}</td>
                        <td>
                            <agregar-quitar-btn :libro="libro" @actualizado="acutalizar"></agregar-quitar-btn>
                            <button class="btn btn-blue ms-2" @click="abrirModal(libro)">
                                Editar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="text-center">No hay libros cargados en la base de datos.</p>
        </section>
    </div>
</template>
<script>
    import CargarLibro from '../components/CargarLibro.vue';
    import AgregarQuitarBtn from '../components/AgregarQuitar.vue';

    export default {
        name: "Wishlist",
        components: { CargarLibro, AgregarQuitarBtn },
        data() {
            return {
                libros: [],
                mostrarModal: false,
                libroSeleccionado: null,
                librosDB: [],
            }
        },
        methods: {
            abrirModal(libro = null) {
                this.libroSeleccionado = libro ? JSON.parse(JSON.stringify(libro)) : null;
                this.mostrarModal = true;
            },
            acutalizar(){
                this.libros = this.obtenerLibrosAgregados();
                this.cargarLibrosDB();
            },
            cerrarModal() {
                this.mostrarModal = false;
                this.libroSeleccionado = null;
                this.libros = this.obtenerLibrosAgregados();
                this.cargarLibrosDB();
            },
            obtenerLibrosAgregados() {
                return JSON.parse(localStorage.getItem('misLibros')) || [];
            },
            async cargarLibrosDB() {
                try {
                    const res = await fetch('http://localhost/server/listarLibros.php');
                    const data = await res.json();
                    if (!data.error) {
                        this.librosDB = data;
                    } else {
                        console.error('Error al cargar libros desde BD:', data.error);
                        this.librosDB = [];
                    }
                } catch (error) {
                    console.error('Error en fetch:', error);
                    this.librosDB = [];
                }
            }
        },
        created() {
            this.acutalizar();
        }
    }
</script>