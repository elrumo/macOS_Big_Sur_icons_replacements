import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import store from './store/store'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'dist/loading.gif',
});
Vue.use(infiniteScroll);


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
