import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import VueMobileDetection from 'vue-mobile-detection'
// import './registerServiceWorker'

const app = createApp(App)

app.use(VueMobileDetection)
app.use(store)
app.use(router)
app.mount('#app')