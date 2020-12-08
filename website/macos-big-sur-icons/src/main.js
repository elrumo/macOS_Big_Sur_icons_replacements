import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import store from './store/store'
import router from './router'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-46945907-10',
  disabled: false,
})

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'dist/loading.gif',
});

Vue.use(Vuex)


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
