import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Libreria from '../views/Libreria.vue';
import CarritoView from '../views/Wishlist.vue';
import DetalleLibro from '../views/LibroDetalle.vue';
import Gestion from '../views/Gestion.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/libros', component: Libreria },
    { path: '/wishlist', component: CarritoView },
    { path: '/gestion', component: Gestion },
    { path: '/libro/:id', component: DetalleLibro, props: true, name: 'detalle-libro' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
