<template>
    <button
        :class="['btn', libroAgregado ? 'btn-red' : 'btn-blue']"
        @click="toggleLibro"
    >
        {{ libroAgregado ? 'Quitar' : 'Agregar' }}
    </button>
</template>

<script>
export default {
    name: "AgregarQuitarBtn",
    emits: ['actualizado'],
    props: {
        libro: {
        type: Object,
        required: true
        }
    },
    data() {
        return {
        libroAgregado: false,
        }
    },
    methods: {
        obtenerLibrosAgregados() {
            return JSON.parse(localStorage.getItem('misLibros')) || [];
        },
        actualizarEstado() {
            const guardados = this.obtenerLibrosAgregados();
            this.libroAgregado = guardados.some(
                l => l.title === this.libro.title && l.author_name?.[0] === this.libro.author_name?.[0]
            );
            },
            toggleLibro() {
            let guardados = this.obtenerLibrosAgregados();

            if (this.libroAgregado) {
                guardados = guardados.filter(
                l => !(l.title === this.libro.title && l.author_name?.[0] === this.libro.author_name?.[0])
                );
            } else {
                if (!guardados.some(l => l.title === this.libro.title && l.author_name?.[0] === this.libro.author_name?.[0])) {
                guardados.push(this.libro);
                }
            }

            localStorage.setItem('misLibros', JSON.stringify(guardados));
            this.actualizarEstado();
            this.$emit('actualizado', guardados);
        }
    },
    mounted() {
        this.actualizarEstado();
    },
    watch: {
        libro: {
            handler() {
                this.actualizarEstado();
            },
            immediate: true
            }
        }
    };
</script>
