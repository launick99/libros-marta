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
    </div>
</template>
<script>
    import AgregarQuitarBtn from '../components/AgregarQuitar.vue';

    export default {
        name: "Wishlist",
        components: { AgregarQuitarBtn },
        data() {
            return {
                libros: [],
            }
        },
        methods: {
            acutalizar(){
                this.libros = this.obtenerLibrosAgregados();
            },
            obtenerLibrosAgregados() {
                return JSON.parse(localStorage.getItem('misLibros')) || [];
            }
        },
        created() {
            this.acutalizar();
        }
    }
</script>