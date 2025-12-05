import { createApp } from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'

/* 
    Esta libreria me hizo recorer los lugares
    mas ocultos de mi computadora para poder 
    hacerla funcionar, pero al final
    logré que funcione, gracias a mmuncada

    que dios lo bendiga

    https://stackoverflow.com/questions/56022493/animate-css-is-not-working-in-chrome-latest-version-version-above-73
 */
import 'animate.css'

import App from './App.vue'
import router from './router'

// aaaaaAAAAAAAAAAAAaaaa
// medio me pisa algunos estilos
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './style.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
})

createApp(App).use(router).use(vuetify).mount('#app')
