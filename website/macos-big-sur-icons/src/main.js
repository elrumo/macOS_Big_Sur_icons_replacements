import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import store from './store/store'
import router from './router'
import VueMobileDetection from 'vue-mobile-detection'
import './registerServiceWorker'

Vue.config.productionTip = false

const loadimage = require('./assets/no-app-icon.png')

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadimage,
  attempt: 2,
});
Vue.use(VueMobileDetection)
Vue.use(Vuex)


new Vue({
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
  router,
  store
}).$mount('#app')
