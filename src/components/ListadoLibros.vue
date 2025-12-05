<template>
    <div>
        <div class="mb-3 w-100 d-flex justify-content-end" v-if="mostrarBuscador">
            <div class="input-group" Style="max-width: 400px;">
                <input
                    v-model="busqueda"
                    @input="buscarLibros"
                    type="text"
                    class="form-control"
                    placeholder="Buscar por título..."
                />
                <button class="input-group-text bg-primary text-white" @click="buscarLibros">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
        <div v-if="cargando" class="d-flex justify-content-center align-items-center py-5">
            <div class="loader"></div>
        </div>
        <div v-else>
            <div v-if="libros.length === 0" class="alert alert-info">
                No se encontraron libros.
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 mb-3 justify-content-center">
                <div
                    v-for="(libro, libindex) in libros"
                    :key="libindex"
                    class="col"
                >
                    <Libro-card
                        :libro="libro"
                        :mostrar="mostrarBuscador"
                        @toggle-libro="agregarQuitarLibro"
                    >
                    </Libro-card>
                </div>
            </div>
            <nav v-if="tieneNavegacion">
                <ul class="pagination justify-content-center flex-wrap">
                    <li
                        class="page-item"
                        :class="{ disabled: paginaActual === 1 }"
                        @click="cambiarPagina(paginaActual - 1)"
                    >
                        <a class="page-link" href="#">Anterior</a>
                    </li>
                    <li
                        v-for="n in paginasVisibles"
                        :key="n"
                        class="page-item"
                        :class="{ active: paginaActual === n }"
                        @click="cambiarPagina(n)"
                    >
                        <a class="page-link" href="#">{{ n }}</a>
                    </li>
                    <li
                        class="page-item"
                        :class="{ disabled: paginaActual === totalPaginas }"
                        @click="cambiarPagina(paginaActual + 1)"
                    >
                        <a class="page-link" href="#">Siguiente</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
    import LibroCard from './Libro.vue';
    export default {
        name: "ListadoLibros",
        components: { LibroCard },
        props: {
            cantidad: { type: Number, default: 15 },
            buscador: { type: Boolean, default: true }
        },
        data() {
            return {
                libros: [],
                busqueda: "",
                paginaActual: 1,
                totalPaginas: 1,
                cargando: false,
                totalResultados: 0,
                librosAgregados: this.obtenerLibrosAgregados(),
            };
        },
        computed: {
            resultadosPorPagina() {
                return this.cantidad;
            },
            mostrarBuscador() {
                return this.buscador;
            },
            tieneNavegacion() {
                return this.totalPaginas > 1 && this.mostrarBuscador;
            },
            paginasVisibles() {
                const total = this.totalPaginas;
                const actual = this.paginaActual;
                let comienzo = Math.max(1, actual - 2);
                let fin = Math.min(total, actual + 2);
                if (fin - comienzo < 4) {
                    if (comienzo == 1) fin = Math.min(total, comienzo + 4);
                    if (fin == total) comienzo = Math.max(1, fin - 4);
                }
                const paginas = [];
                for (let i = comienzo; i <= fin; i++){
                    paginas.push(i);  
                } 
                return paginas;
            }
        },
        methods: {
            buscarLibros() {
                this.paginaActual = 1;
                this.CambiarUrl();
                this.obtenerLibros();
            },
            obtenerLibros(cargar = true) {
                this.cargando = cargar;
                const query = this.busqueda.trim() ? `&title=${encodeURIComponent(this.busqueda)}` : "&title=a";
                fetch(`https://openlibrary.org/search.json?limit=${this.resultadosPorPagina}&page=${this.paginaActual}${query}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const agregados = this.obtenerLibrosAgregados();
                        this.libros = data.docs.map(libro => {
                            return {
                                ...libro,
                                agregado: agregados.some(l => l.title == libro.title && l.author_name?.[0] == libro.author_name?.[0])
                            }
                        });
                        // console.log(this.libros);
                        
                        this.totalResultados = data.numFound;
                        this.totalPaginas = Math.ceil(this.totalResultados / this.resultadosPorPagina);
                    })
                    .catch((error) => {
                        this.libros = [];
                        console.log("----- Error lanzado al hacer fetch -----");
                        console.warn("Error fetching books:", error);
                        console.log("----- Error lanzado al hacer fetch -----");
                    })
                    .finally(() => {
                        this.cargando = false;
                    });
            },
            obtenerLibrosAgregados(){
                return JSON.parse(localStorage.getItem('misLibros')) || [];
            },
            agregarQuitarLibro(libro) {
                if (libro.agregado) {
                    let guardados = [];
                    try {
                        guardados = this.obtenerLibrosAgregados();
                    } catch (e) {
                        console.error("Error al obtener los libros guardados:", e);
                        guardados = [];
                    }
                    guardados = guardados.filter(l => !(l.title == libro.title && l.author_name?.[0] == libro.author_name?.[0]));
                    localStorage.setItem('misLibros', JSON.stringify(guardados));
                } else {
                    let guardados = [];
                    try {
                        guardados = this.obtenerLibrosAgregados();
                    } catch (e) {
                        console.error("Error al obtener los libros guardados:", e);
                        guardados = [];
                    }
                    if (!guardados.some(l => l.title == libro.title && l.author_name?.[0] == libro.author_name?.[0])) {
                        guardados.push(libro);
                        localStorage.setItem('misLibros', JSON.stringify(guardados));
                    }
                }
                this.librosAgregados = this.obtenerLibrosAgregados();
            },
            cambiarPagina(nuevaPagina) {
                if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas){
                    return;
                }
                this.paginaActual = nuevaPagina;
                this.CambiarUrl();
                this.obtenerLibros();
            },
            CambiarUrl() {
                if(!this.mostrarBuscador) {
                    return; // evitar bug en home
                }
                if (this.$route && this.$router) {
                    this.$router.replace({
                        query: {
                            ...this.$route.query,
                            busqueda: this.busqueda || undefined,
                            pagina: this.paginaActual != 1 ? this.paginaActual : undefined
                        }
                    });
                }
            },
            cargarDesdeUrl() {
                if(!this.mostrarBuscador) {
                    return; // evitar bug en home
                }
                if (this.$route) {
                    const { busqueda, pagina } = this.$route.query;
                    if (busqueda){
                        this.busqueda = busqueda;
                    }
                    if(pagina){
                        this.paginaActual = parseInt(pagina);
                    }
                }
            }
        },
        created() {
            this.cargarDesdeUrl();
            this.obtenerLibros();
            this.obtenerLibrosAgregados();
        },
        watch: {
            cantidad() {
                this.paginaActual = 1;
                this.obtenerLibros();
            },
            librosAgregados() {
                this.obtenerLibros(false);
            }
        },
    };
</script>