// Polyfill for Parse LiveQuery EventEmitter issue in ESM mode
import { EventEmitter } from 'events'
if (typeof window !== 'undefined') {
  window.EventEmitter = EventEmitter
}

import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import VueMobileDetection from 'vue-mobile-detection'
import VueLazyLoad from 'vue3-lazyload'
import VueCookies from 'vue3-cookies'
import { createHead } from '@unhead/vue/client'
import * as Sentry from '@sentry/vue'
import ui from '@nuxt/ui/vue-plugin'

// Initialize Parse before app loads
import Parse from 'parse';

const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = import.meta.env.VITE_PARSE_URL

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = VITE_PARSE_URL

// Import main CSS with Tailwind and NuxtUI
import './assets/main.css'

// import '@adobe/coral-spectrum/dist/css/coral.min.css';
// import "@adobe/coral-spectrum/dist/js/coral.js"
// import "@adobe/coral-spectrum/dist/css/coral.css"

const head = createHead()
const app = createApp(App)

// Sentry/Bugsink - uncomment after running: bun add @sentry/vue@7
// Sentry.init({
//   app,
//   dsn: "https://d520de73e2ac4fffa252f00e2677d5b9@bugs.macosicons.com/1",
//   release: "macOSicons-1",
//   integrations: [
//     new Sentry.BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//     }),
//   ],
//   tracesSampleRate: 0,
// })

app.use(ui)
app.use(VueCookies, {
  expireTimes: '30d'
})
app.use(VueMobileDetection)
app.use(store)
app.use(head)
app.use(router)
app.use(VueLazyLoad, {
    // options...
  })
app.mount('#app')