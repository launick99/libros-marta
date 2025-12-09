<template>
    <div>
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

    export default {
        name: "Wishlist",
        components: { CargarLibro },
        data() {
            return {
                libros: [],
                mostrarModal: false,
                libroSeleccionado: null,
                librosDB: [],
            }
        },
        methods: {
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
            },
            abrirModal(libro = null) {
                this.libroSeleccionado = libro ? JSON.parse(JSON.stringify(libro)) : null;
                this.mostrarModal = true;
            },
            cerrarModal() {
                this.mostrarModal = false;
                this.libroSeleccionado = null;
                this.libros = this.obtenerLibrosAgregados();
            },
        }
    }

</script>