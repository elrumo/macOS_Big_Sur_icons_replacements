import { createApp, configureCompat } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import VueMobileDetection from 'vue-mobile-detection'
import VueLazyLoad from 'vue3-lazyload'
import VueCookies from 'vue3-cookies'
import { createHead } from '@unhead/vue/client'
import * as Sentry from '@sentry/vue'

// import '@adobe/coral-spectrum/dist/css/coral.min.css';

// import "@adobe/coral-spectrum/dist/js/coral.js"
// import "@adobe/coral-spectrum/dist/css/coral.css"
// import './registerServiceWorker'

const head = createHead()
const app = createApp(App)

// if (import.meta.env.VITE_BUGSINK_DSN) {
  Sentry.init({
    app,
    dsn: 'https://d520de73e2ac4fffa252f00e2677d5b9@bugs.macosicons.com/1',
    release: "macOSicons-1",
    integrations: [
      Sentry.browserTracingIntegration({ router }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.0, // Set to 1.0 to capture 100% of transactions for performance monitoring.
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/macosicons\.com/],
  })
// }

configureCompat({
  WATCH_ARRAY: false
})

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