<template>
    <div class="container my-5 libreria">
        <div class="text-center">
            <h2 class="text-secondary-ml animate__animated animate__fadeIn">Librería</h2>
            <p class="animate__animated animate__fadeIn">explora todos los libros de esta biblioteca!</p>
        </div>
        <listado-libros :cantidad="15" :buscador="true"></listado-libros>
    </div>
</template>

<script>
    import ListadoLibros from '../components/ListadoLibros.vue'
    export default {
        name: 'Libreria',
        components: { ListadoLibros },
    }
</script>
