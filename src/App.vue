<template>
  <div id="app">
    <!-- <coral-toast id="toastMessage" variant="success">
      All icons have been uploaded.
    </coral-toast> -->

    <Header
      :distanceFromTop="distanceFromTop"
      :submitIconDialog="'submitIcon'"
    />

    <StickyBanner/>

    <div class="min-height">
      <router-view
        v-slot="{ Component }"
      >
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path"/>
        </transition>
      </router-view>
    </div>

    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import StickyBanner from '@/components/StickyBanner.vue'

import { Toast } from '@adobe/coral-spectrum/coral-component-toast'
const appBody = document.getElementById('app')

// import '@adobe/spectrum-css/dist/icons/spectrum-css-icons.svg' 
// import '@adobe/spectrum-css/dist/icons/loadIcons.js' 


export default {
  name: 'App',
  components: {
    Header,
    Footer,
    StickyBanner
  },

  data(){
    return{
      distanceFromTop: true,
      isBanner: true
    }
  },

  // watch:{
  //   $route:{
  //     handler(to, from) {
  //       // console.log(to);
  //       // console.log(from);
  //       _bsa.reload('.target-class-name')
  //     },
  //     deep: true
  //   }
  // },

  methods:{
    handleScroll () {
      let currentRoute = this.$router.currentRoute.value.name;
      let searchBar = document.getElementById("searchBar");
      if (currentRoute == "Home" && searchBar) {
          this.distanceFromTop =  document.getElementById("searchBar").getBoundingClientRect().y > 65;
      }
    },

    createToast(){
      const toast = new Toast()
      toast.id = 'toastMessage';
      toast.variant = 'success';
      appBody.appendChild(toast)
    }
  },

  mounted: function(){
    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll);
    }, 500);

    this.createToast()
  }
}
</script>

<style>

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height: 100vh;
    /* position: table; */
  } 

  .min-height{
    /* min-height: calc(100vh - 125px); */
    min-height: calc(100vh - 115px);
    margin: auto;
  }

</style>