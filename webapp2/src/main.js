import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
});

import App from './App.vue'
import createRouter from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(createRouter())
app.use(vuetify)
app.mount('#app')


