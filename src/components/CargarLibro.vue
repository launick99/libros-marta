<template>
    <div>
        <!-- <Transition
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut" 
        > -->
            <div v-if="mostrar" class="modal-backdrop show"></div>
        <!-- </Transition> -->
        <Transition
            enter-active-class="animate__animated animate__bounceInUp"
            leave-active-class="animate__animated animate__bounceOutDown" 
        >
            <div v-if="mostrar" class="modal modal-lg d-block" tabindex="-1">
                <div class="modal-dialog">
                    <form class="modal-content" autocomplete="off" @submit.prevent="agregarLibro">
                        <div class="modal-header">
                            <p class="modal-title h5">{{ title || 'Nuevo libro' }}</p>
                            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-4 align-items-start">
                                <div class="col-12 col-sm-6 col-md-8 col-lg-9">
                                    <div class="form-outline mb-1 position-relative">
                                        <label class="form-label" for="titulo">Título:</label>
                                        <input :disabled="libro" ref="tituloInput" type="text" id="titulo" :class="[titulo ? (tituloValido ? 'is-invalid' : 'is-valid') : '', 'form-control form-control-sm']" v-model="titulo" />
                                        <p v-if="tituloValido" class="text-danger" Style="font-size: 0.6rem;">*{{ tituloValido }}</p>
                                        <ul v-if="libros.length" class="list-group position-absolute w-100 shadow sugerencias-dropdown">
                                            <li 
                                                v-for="(lib, index) in libros" 
                                                :key="index" 
                                                @click="seleccionarLibro(lib)"
                                                class="list-group-item list-group-item-action"
                                                style="cursor: pointer;"
                                            >
                                                {{ lib.title }} -
                                                <template v-for="(author, a) in lib.author_name" :key="a">
                                                    <span Style="font-size: 0.8rem;" class="text-muted">
                                                        <em>{{ author }}</em>
                                                        <span v-if="a < (lib.author_name.length - 1)">, </span>
                                                        <span v-else>.</span>
                                                    </span>
                                                </template>
                                            </li>
                                        </ul>
                                    </div>
    
                                    <div class="form-outline mb-1">
                                        <label class="form-label" for="autor">Autor:</label>
                                        <input :disabled="libro" type="text" id="autor" class="form-control form-control-sm" v-model="autor" :class="[autor ? (autorValido ? 'is-invalid' : 'is-valid') : '', 'form-control form-control-sm']" />
                                        <p v-if="autorValido" class="text-danger" Style="font-size: 0.6rem;">*{{ autorValido }}</p>
                                    </div>
    
                                    <div class="form-outline mb-1">
                                        <label class="form-label" for="fecha">Fecha:</label>
                                        <input type="Number" id="fecha" class="form-control form-control-sm" v-model="fecha" :class="[fecha ? (fechaValida ? 'is-invalid' : 'is-valid') : '', 'form-control form-control-sm']" />
                                        <p v-if="fechaValida" class="text-danger" Style="font-size: 0.6rem;">*{{ fechaValida }}</p>
                                    </div>
                                        <div class="form-outline mb-1">
                                        <label class="form-label" for="autor">Link Portada:</label>
                                        <input type="text" id="portada" class="form-control form-control-sm" v-model="portada"/>
                                    </div>
                                </div>
                                <!-- Portada -->
                                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <img 
                                        :src="portada || 'https://i.pinimg.com/236x/84/65/87/846587c087f51b0db5fff312951a3e8f.jpg'" 
                                        :alt="titulo || 'Portada vacía'" 
                                        class="img-fluid rounded shadow-sm portada"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-red me-4" @click="$emit('close')">Close</button>
                            <button type="submit" class="btn btn-blue" :disabled="!formularioValido">{{ accion }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
    export default {
        name: "CargarLibro",
        emits: ['close'],
        props: {
            mostrar: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: ''
            },
            accion: {
                type: String,
                default: 'Agregar'
            },
            libro:{
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                //formulario
                titulo: '',
                autor: '',
                fecha: '',
                portada: '',

                //api
                libros: [],
                seleccionado: false, //para que salte otra vez la lista cuando se selecciona un libro de la api
            }
        },
        methods: {
            limpiarFormulario() {
                this.titulo = '';
                this.autor = '';
                this.portada = null;
                this.fecha = null;
                this.libros = [];
            },
            // API
            buscarLibros(titulo) {
                if(!this.seleccionado){
                    fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(titulo)}&limit=5`)
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);
                        this.libros = data.docs.slice(0, 5);
                    })
                    .catch(() => {
                        this.libros = [];
                    })
                }else{
                    this.seleccionado = false;
                }
            },
            // API
            // https://openlibrary.org/dev/docs/api/covers
            seleccionarLibro(libro) {
                this.titulo = libro.title;
                this.autor = libro.author_name ? libro.author_name[0] : 'N/A';
                this.portada = `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`;
                this.fecha = libro.first_publish_year || '2025';
                this.libros = [];
                this.seleccionado = true;
            },
            obtenerLibrosAgregados(){
                return JSON.parse(localStorage.getItem('misLibros')) || [];
            },
            async agregarLibro() {
                if (!this.formularioValido){
                    return;
                }

                const nuevoLibro = {
                    title: this.titulo,
                    author_name: [this.autor],
                    portada: this.portada,
                    first_publish_year: this.fecha,
                };

                try {
                    const response = await fetch('http://localhost/server/guardarLibro.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nuevoLibro)
                    });
                    const result = await response.json();

                    if (result.success) {
                        console.log('Libro guardado correctamente en la base de datos.');
                        this.$emit('close');
                        this.limpiarFormulario();
                    } else {
                        console.error('Error al guardar el libro: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error en la comunicación con el servidor.');
                    console.error(error);
                }
            },
        },
        computed: {
            tituloValido() {
                if (this.titulo.trim().length == 0) {
                    return null
                }
                if (this.titulo.trim().length < 5) {
                    return "El título debe tener al menos 5 caracteres."
                }
                return null;
            },
            autorValido() {
                if (this.autor.trim().length === 0){
                    return null
                }
                if (this.autor.trim().length < 5) {
                    return "El autor debe tener al menos 5 caracteres."
                }
                return null;
            },
            fechaValida() {
                if (!this.fecha){
                    return null
                }
                if (this.fecha <= 1200 || this.fecha > new Date().getFullYear()) {
                    return "La fecha no es válida. Debe ser un año válido entre 1200 y el año actual.";
                }
                return null;
            },
            formularioValido() {    //cambio esto para mostrar mensajitos de error
                return (
                    !this.tituloValido && this.titulo.length &&
                    !this.autorValido && this.autor.length &&
                    !this.fechaValida && this.fecha
                );
            }
        },
        // vimos esto en clase?
        watch: {
            titulo(nuevo) {
                if (nuevo.trim().length < 3) {
                    this.libros = [];
                    return;
                }
                if(this.$refs.tituloInput == document.activeElement) {
                    this.buscarLibros(nuevo);
                }
                return;
            },
            libro: {
                handler(lib) {
                    this.titulo = lib ? lib.title : '',
                    this.autor = lib?.author || lib?.author_name?.[0] || '';
                    this.fecha = lib ? lib.first_publish_year : '',
                    this.portada = lib ? lib.portada : null
                },
                immediate: true
            }
        },
    }
</script>