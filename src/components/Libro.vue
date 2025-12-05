<template>
    <div class="card h-100 shadow-sm">
        <img
            v-if="libro.cover_i || libro.portada"
            :src="libro.portada || `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`"
            :alt="`Portada de '${libro.title}' de ${libro.author_name ? libro.author_name[0] : 'Desconocido'}`"
            class="card-img-top"
            Style="height: 220px; object-fit: cover;"
        />
        <div class="card-body d-flex flex-column">
            <h3 class="card-title mb-1">{{ libro.title }}</h3>

            <p class="card-text mb-1" v-if="libro.author_name">
                <small>Autor:
                    <template v-for="(author, a) in libro.author_name" :key="a">
                        <span>{{ author }}</span>
                        <span v-if="a < (libro.author_name.length - 1)">, </span>
                        <span v-else>.</span>
                    </template>
                </small>
            </p>

            <p class="card-text mb-0" v-if="libro.first_publish_year">
                <small>Año: {{ libro.first_publish_year }}</small>
            </p>

            <div class="w-100 mt-auto text-center">
                <router-link 
                    v-if="libro.cover_edition_key"
                    :to="{ name: 'detalle-libro', params: { id: libro.cover_edition_key } }"
                    class="btn btn-blue me-1" 
                    style="background: #6c757d; border: solid 1px #6c757d !important;"
                >
                    Detalles
                </router-link>
                <agregar-quitar-btn :libro="libro"></agregar-quitar-btn> 
            </div>
        </div>
    </div>
</template>
<script>
    import AgregarQuitarBtn from './AgregarQuitar.vue';
    export default {
        name: 'Libro',
        components: { AgregarQuitarBtn },
        props: {
            libro: {
                type: Object,
                required: true
            },
            mostrarBoton: {
                type: Boolean,
                default: true
            }
        }
    };
</script>
