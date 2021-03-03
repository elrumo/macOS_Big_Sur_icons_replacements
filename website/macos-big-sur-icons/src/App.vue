<template>
  <div id="app">
    <Header
      :distanceFromTop="true"
      :submitIconDialog="'submitIcon'"
    />
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
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
import '@adobe/coral-spectrum/coral-component-overlay'

import '@adobe/coral-spectrum/coral-css-link'
import '@adobe/coral-spectrum/coral-css-formgroup'
import '@adobe/coral-spectrum/coral-css-well'
import '@adobe/coral-spectrum/coral-css-divider'

import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  methods:{}
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