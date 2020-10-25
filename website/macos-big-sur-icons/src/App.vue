<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import '@adobe/coral-spectrum'
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