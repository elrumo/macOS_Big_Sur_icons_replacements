import { createApp, configureCompat } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import VueMobileDetection from 'vue-mobile-detection'
import VueLazyLoad from 'vue3-lazyload'
import vueCookies from 'vue-cookies'
import { createHead } from '@unhead/vue/client'

// import '@adobe/coral-spectrum/dist/css/coral.min.css';

// import "@adobe/coral-spectrum/dist/js/coral.js"
// import "@adobe/coral-spectrum/dist/css/coral.css"
// import './registerServiceWorker'

const head = createHead()
const app = createApp(App)

configureCompat({ WATCH_ARRAY: false })

app.use(vueCookies)
app.$cookies.config('30d')
app.use(VueMobileDetection)
app.use(store)
app.use(head)
app.use(router)
app.use(VueLazyLoad, {
    // options...
  })
app.mount('#app')