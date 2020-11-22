<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import '@adobe/coral-spectrum/dist/js/coral.js'
import '@adobe/coral-spectrum/dist/css/coral.css'

// import * as firebase from "firebase";
// let firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_KEY,
//   messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_APP_ID,
//   measurementId: process.env.VUE_APP_MEASUREMENT_ID,
//   authDomain: "macos-icons.firebaseapp.com",
//   databaseURL: "https://macos-icons.firebaseio.com",
//   projectId: "macos-icons",
//   storageBucket: "macos-icons.appspot.com"
// };
// firebase.initializeApp(firebaseConfig);


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