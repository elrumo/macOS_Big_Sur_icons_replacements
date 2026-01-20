<template>
  <UApp>
    <div id="app">

      <Announcement type="topBanner"/>

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
  </UApp>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import StickyBanner from '@/components/StickyBanner.vue'
import Announcement from '@/components/Announcement.vue'
import { mapActions, mapGetters } from 'vuex'

import dummyData from '@/components/announcementDummy.json'

// Parse is initialized in main.js
import Parse from 'parse/dist/parse.min.js'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    StickyBanner,
    Announcement,
  },

  data(){
    return{
      distanceFromTop: true,
      isBanner: true,
      dummyData: dummyData
    }
  },

  mounted(){
    // Toast is now handled by NuxtUI's useToast composable
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
  },

  computed:{
    ...mapGetters([
      'getHomeDialog',
    ])
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
  }

  .min-height{
    min-height: calc(100vh - 115px);
    margin: auto;
  }

</style>
