import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css' // Make sure to import the CSS

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('v-select', VueSelect)

app.mount('#app')
