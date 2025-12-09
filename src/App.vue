<template>
    <header>
        <nav class="navbar navbar-expand-md shadow-sm">
            <div class="container">
                <h1>
                    <router-link class="navbar-brand" to="/">Los Libros de Marta</router-link>
                </h1>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <router-link class="nav-link pb-0 ps-0 me-2" activeClass="active border-bottom border-2 border-blue" to="/">Inicio</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link pb-0 ps-0 me-2" activeClass="active border-bottom border-2 border-blue" to="/libros">Mis libros</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link pb-0 ps-0 me-2" activeClass="active border-bottom border-2 border-blue" to="/Wishlist">Wishlist</router-link>
                        </li>
                        <li>
                            <router-link class="nav-link pb-0 ps-0 me-2" activeClass="active border-bottom border-2 border-blue" to="/gestion">Gestion</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <router-view></router-view>
    </main>
    <footer>
        <div class="container py-4">
            <div class="logo my-2" style="width: 172px">
                <a href="https://davinci.edu.ar/" class="davinci"></a>
            </div>
            <p>FINAL - 2025 Turno Noche</p>
            <p>Arroyo Alan Lautaro</p>
        </div>
    </footer>
</template>

<script>
    export default {
        name: 'App',
    }
</script>
