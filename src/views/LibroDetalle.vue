<template>
    <section class="container my-5">
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-secondary mb-3" role="status"></div>
            <p class="text-muted">Cargando libro...</p>
        </div>
        <div v-else-if="!libro" class="alert alert-warning text-center">
            Libro no encontrado.
        </div>

        <div v-else class="row g-4 animate__animated animate__fadeIn">
            <!-- Portada -->
            <div class="col-md-4 text-center">
                <img
                    :src="libro.cover ? (libro.cover.large || libro.cover.medium || libro.cover.small) : 'https://images.cdn1.buscalibre.com/fit-in/360x360/dd/cc/ddcc709d0fa44d35e9c9497003926e42.jpg'"
                    :alt="`Portada de ${libro.title}`"
                    class="img-fluid rounded shadow"
                />
                <a v-if="libro.url" :href="libro.url" target="_blank" class="w-100 btn btn-sm btn-outline-secondary">
                    Ver en OpenLibrary
                </a>
                <agregar-quitar-btn class="w-100" :libro="libro"></agregar-quitar-btn> 
            </div>

            <div class="col-md-8">
                <h2 class="text-secondary mb-4">{{ libro.title }}</h2>
                <p>
                    <strong>Autor/es:</strong>
                    <span v-if="libro.author_name && libro.author_name.length">
                        {{ libro.author_name.join(', ') }}.
                    </span>
                    <span v-else>Desconocido</span>
                </p>

                <p v-if="libro.publish_date"><strong>Publicado en:</strong> {{ libro.publish_date }}.</p>
                <p v-if="libro.number_of_pages"><strong>Páginas:</strong> {{ libro.number_of_pages }}.</p>

                <p v-if="libro.publishers && libro.publishers.length">
                    <strong>Editorial:</strong> {{ libro.publishers.join(', ') }}.
                </p>

                <div v-if="libro.description">
                    <strong>Descripción:</strong>
                    <p class="text-muted">{{ libro.description }}</p>
                </div>

                <div v-if="libro.subjects && libro.subjects.length">
                    <strong>Temas:</strong>
                    <div class="d-flex flex-wrap gap-1 mt-1">
                        <span v-for="(tema, i) in libro.subjects" :key="`s-${i}`" class="p-2 badge bg-secondary text-white">
                            {{ tema }}
                        </span>
                    </div>
                </div>

                <div v-if="libro.subject_people && libro.subject_people.length" class="mt-3">
                    <strong>Personajes:</strong>
                    <div class="d-flex flex-wrap gap-1 mt-1">
                        <span v-for="(personaje, i) in libro.subject_people" :key="`p-${i}`" class="p-2 badge bg-primary text-white">
                            {{ personaje }}
                        </span>
                    </div>
                </div>

                <div v-if="libro.subject_places && libro.subject_places.length" class="mt-3">
                    <strong>Lugares:</strong>
                    <div class="d-flex flex-wrap gap-1 mt-1">
                        <span v-for="(lugares, i) in libro.subject_places" :key="`pl-${i}`" class="p-2 badge bg-secondary-subtle text-dark">
                            {{ lugares }}
                        </span>
                    </div>
                </div>

                <div v-if="libro.subject_times && libro.subject_times.length" class="mt-3">
                    <strong>Época:</strong>
                    <div class="d-flex flex-wrap gap-1 mt-1">
                        <span v-for="(tiempo, i) in libro.subject_times" :key="`t-${i}`" class="p-2 badge bg-warning-subtle text-dark">
                            {{ tiempo }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import AgregarQuitarBtn from '../components/AgregarQuitar.vue';
    export default {
        name: "DetalleLibro",
        components: { AgregarQuitarBtn },
        data() {
            return {
                libro: null,
                cargando: true,
            };
        },
        methods: {
            cargarLibro() {
                let id = this.$route.params.id;

                if (!id) {
                    this.cargando = false;
                    return;
                }

                const guardados = JSON.parse(localStorage.getItem('misLibros')) || [];
                const local = guardados.find(
                    l => l.cover_edition_key === id || `${l.title}-${l.author_name?.[0]}` === id
                );

                if (local) {
                    this.libro = local;
                    this.cargando = false;
                    return;
                }

                // Buscar
                fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${id}&format=json&jscmd=data`)
                    .then(response => response.json())
                    .then(data => {
                        const libro = data[`OLID:${id}`];
                        if (!libro) {
                            this.libro = null;
                            return;
                        }
                        // console.log(libro);
                        
                        this.libro = {
                            title: libro.title,
                            author_name: (libro.authors ? libro.authors.map(a => a.name) : null) || ['Autor desconocido'],
                            authors_full: libro.authors ? libro.authors : [],
                            description: typeof libro.description === 'string'
                                ? libro.description
                                : (libro.description ? libro.description.value : ''),
                            publish_date: libro.publish_date ? libro.publish_date : 'Desconocida',
                            number_of_pages: libro.number_of_pages ? libro.number_of_pages : null,
                            publishers: libro.publishers ? libro.publishers.map(p => p.name) : [],
                            cover: {
                                large: libro.cover ? libro.cover.large : null,
                                medium: libro.cover ? libro.cover.medium : null,
                                small: libro.cover ? libro.cover.small : null,
                            },
                            subjects: libro.subjects ? libro.subjects.map(s => s.name) : [],
                            subject_people: libro.subject_people ? libro.subject_people.map(p => p.name) : [],
                            subject_places: libro.subject_places ? libro.subject_places.map(p => p.name) : [],
                            subject_times: libro.subject_times ? libro.subject_times.map(t => t.name) : [],
                            url: libro.url ? libro.url : '',
                            openlibrary_id: id
                        };
                    })    .catch(error => {
                        console.error("Error cargando", error);
                        this.libro = null;
                    })
                    .finally(() => {
                        this.cargando = false;
                    });
            }
        },
        created() {
            this.cargarLibro();
        }
    };
</script>
