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
import { mapActions } from 'vuex'

import { Toast } from '@adobe/coral-spectrum/coral-component-toast'
const appBody = document.getElementById('app')

import Parse from 'parse/dist/parse.min.js';

// TODO: remove credentials
const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = 'https://media.macosicons.com/parse'

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


  mounted(){
    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll);
    }, 500);

    this.createToast()

    this.fetchSavedIcons()
  },

  methods:{

  ...mapActions([
      'setDataToArr',
      'pushDataToArr',
    ]),

    async fetchSavedIcons(){
      if (!Parse.User.current()){
        return 
      }

      let savedIconsQuery = Parse.User.current().relation("favIcons").query()
      let userSavedIconData = await savedIconsQuery.descending("createdAt").find()

      let savedIconCount = await savedIconsQuery.count();
      this.setDataToArr({arr: 'savedIconCount', data: savedIconCount})
      
      let savedIcons = userSavedIconData.map(( icons ) => icons);
      let iconsToShow = []        

      savedIcons.forEach(icon => {
        let newIcon = {}
        for(let prop in icon.attributes){
          newIcon[prop] = icon.attributes[prop]
        }
        newIcon.isSaved = true
        iconsToShow.push(newIcon);
        newIcon.id = icon.id;
      })
      
      this.pushDataToArr({ data: iconsToShow, arr: "savedIcons" })
      return iconsToShow
    },

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