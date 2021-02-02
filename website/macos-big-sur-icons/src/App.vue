<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import '@adobe/coral-spectrum/coral-component-dialog'
import '@adobe/coral-spectrum/coral-component-button'
import '@adobe/coral-spectrum/coral-component-toast'
import '@adobe/coral-spectrum/coral-component-icon'
import '@adobe/coral-spectrum/coral-component-wait'
import '@adobe/coral-spectrum/coral-component-progress'
import '@adobe/coral-spectrum/coral-component-quickactions'
import '@adobe/coral-spectrum/coral-component-fileupload'
import '@adobe/coral-spectrum/coral-component-textfield'
import '@adobe/coral-spectrum/coral-component-search'

// import '@adobe/spectrum-css/dist/icons/loadIcons.js'
// import '@adobe/spectrum-css/dist/components/link/index.css'
import '@adobe/coral-spectrum/dist/css/coral.css'

export default {
  name: 'App',
  components: {
    Home
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
} 
</style>