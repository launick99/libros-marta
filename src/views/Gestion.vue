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
            <table class="table table-striped table-hover" v-if="libros.length">
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
                    <tr v-for="libro in libros" :key="libro.id">
                        <td>
                        <img
                            :src="portada(libro)"
                            alt="Portada"
                            style="height: 90px; object-fit: cover;"
                        />
                        </td>
                        <td>{{ libro.title }}</td>
                        <td>{{ autores(libro) }}</td>
                        <td>{{ libro.publish_date || 'Desconocido' }}</td>
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
            }
        },
        methods: {
            async cargarLibrosDB() {
                try {
                    const response = await fetch('http://localhost/libros-marta/server/listarLibros.php', {
                        method: 'GET'
                    });
                    
                    const data = await response.json();
                    if (!data.error) {
                        this.libros = data;
                    } else {
                        console.error('Error al cargar libros desde BD:', data.error);
                        this.libros = [];
                    }
                } catch (error) {
                    console.error('Error en fetch:', error);
                    this.libros = [];
                }
            },
            abrirModal(libro = null) {
                this.libroSeleccionado = libro ? JSON.parse(JSON.stringify(libro)) : null;
                this.mostrarModal = true;
            },
            cerrarModal() {
                this.mostrarModal = false;
                this.libroSeleccionado = null;
            },
            autores(libro){
                return JSON.parse(libro.authors).join(', ');
            },
            portada(libro){
                return libro.cover  || 'https://images.cdn1.buscalibre.com/fit-in/360x360/dd/cc/ddcc709d0fa44d35e9c9497003926e42.jpg';
            }
        },
        computed:{
            //
        },
        mounted() {
            this.cargarLibrosDB();
        }
    }

</script>