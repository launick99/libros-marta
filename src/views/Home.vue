<template>
    <div>
        <img
            draggable="false"
            class="img-fluid portada animate__animated animate__pulse"
            src="https://static.vecteezy.com/system/resources/previews/008/424/172/non_2x/bookshelf-with-business-books-shelf-with-books-about-finance-marketing-management-strategy-goals-time-management-team-work-banner-for-library-book-store-illustration-in-flat-style-vector.jpg"
            alt="Estante con libros"
        >
    </div>
    <section class="home container my-5">
        <div class="text-center">
            <h2 class="text-secondary-ml animate__animated animate__fadeIn">
                Bienvenido a tu Biblioteca Personal
            </h2>
            <p class="animate__animated animate__fadeIn">
                Aquí podés organizar tus libros, llevar tu wishlist y disfrutar la magia de la lectura.
            </p>
            <div class="animate__animated animate__fadeIn">
                <router-link
                    to="/libros"
                    class="btn btn-blue mx-2"
                >
                    Ver Librería
                </router-link>
                <router-link
                    to="/wishlist"
                    class="btn btn-blue mx-2"
                >
                    Mi Wishlist
                </router-link>
            </div>
        </div>
        <div class="featured my-5 animate__animated animate__backInUp">
            <!-- esto es una mentira, trae los primeros 3 libros con A xD -->
            <h2 class="text-center text-secondary-ml">
                Libros destacados
            </h2>
            <listado-libros
                :cantidad="3"
                :buscador="false"
            />
        </div>
    </section>
</template>

<script>
import ListadoLibros from '../components/ListadoLibros.vue'
export default {
    name: 'Home',
    components: { ListadoLibros },
}
</script>
