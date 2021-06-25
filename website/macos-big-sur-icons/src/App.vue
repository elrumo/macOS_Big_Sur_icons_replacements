<template>
  <div id="app">
            <!-- <div id="logobar"></div> -->
    <coral-toast id="toastMessage" variant="success">
      All icons have been uploaded.
    </coral-toast>

    <Header
      coral-dragaction=""
      :distanceFromTop="distanceFromTop"
      :submitIconDialog="'submitIcon'"
    />
    <router-view
      :key="$route.fullPath"
      class="min-height"
    />
    <Footer/>
  </div>
</template>

<script>
// import '@adobe/coral-spectrum/coral-component-dialog'
// import '@adobe/coral-spectrum/coral-component-icon/src/resources/spectrum-icons.svg';
// import '@adobe/coral-spectrum/coral-component-icon/src/resources/spectrum-icons-color.svg';
// import '@adobe/coral-spectrum/coral-component-icon/src/resources/spectrum-css-icons.svg';

// import '@adobe/coral-spectrum/coral-component-button'
// import '@adobe/coral-spectrum/coral-component-toast'
// import '@adobe/coral-spectrum/coral-component-icon'


// import '@adobe/coral-spectrum/coral-component-status'
// import '@adobe/coral-spectrum/coral-component-checkbox'
// import '@adobe/coral-spectrum/coral-component-wait'
// import '@adobe/coral-spectrum/coral-component-progress'
// import '@adobe/coral-spectrum/coral-component-quickactions'
// import '@adobe/coral-spectrum/coral-component-fileupload'
// import '@adobe/coral-spectrum/coral-component-textfield'
// import '@adobe/coral-spectrum/coral-component-textfield'
// import '@adobe/coral-spectrum/coral-component-search'
// import '@adobe/coral-spectrum/coral-component-overlay'
// import '@adobe/coral-spectrum/coral-component-popover'
// import '@adobe/coral-spectrum/coral-component-switch'
// import '@adobe/coral-spectrum/coral-component-tooltip'
// import '@adobe/coral-spectrum/coral-component-alert'
// import '@adobe/coral-spectrum/coral-component-charactercount'
// import '@adobe/coral-spectrum/coral-component-tablist'
// import '@adobe/coral-spectrum/coral-component-panelstack'
// import '@adobe/coral-spectrum/coral-component-wizardview'

// import '@adobe/coral-spectrum/coral-css-link'
// import '@adobe/coral-spectrum/coral-css-formgroup'
// import '@adobe/coral-spectrum/coral-css-well'
// import '@adobe/coral-spectrum/coral-css-divider'

import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

// import '@adobe/spectrum-css/dist/icons/spectrum-css-icons.svg' 
// import '@adobe/spectrum-css/dist/icons/loadIcons.js' 

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  data(){
    return{
      distanceFromTop: true
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
  min-height: calc(100vh - 125px);
  margin: auto;
}

</style>