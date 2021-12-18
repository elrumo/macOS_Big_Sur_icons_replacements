<template>
  <div id="app">
    <coral-toast id="toastMessage" variant="success">
      All icons have been uploaded.
    </coral-toast>

      <!-- :distanceFromTop="distanceFromTop" -->
    <!-- <Header
      :submitIconDialog="'submitIcon'"
    /> -->

    <StickyBanner/>
    
    <!-- <transition name="fade" mode="out-in"> -->
        <!-- :key="$route.fullPath" -->
      <router-view
        :key="'$route.fullPath'"
        class="min-height"
      />
    <!-- </transition> -->

    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import StickyBanner from '@/components/StickyBanner.vue'

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

  watch:{
    $route (to, from){
        // console.log(to);
        // console.log(from);
        // _bsa.reload('.target-class-name')
    }
  },

  methods:{
    handleScroll () {
      let parent = this
      let currentRoute = parent.$router.currentRoute.name;
      if (currentRoute == "Home") {
        this.distanceFromTop =  document.getElementById("searchBar").getBoundingClientRect().y > 65;
      }
    },

  },

  mounted: function(){
    window.addEventListener('scroll', this.handleScroll);
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