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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import StickyBanner from '@/components/StickyBanner.vue'
import Announcement from '@/components/Announcement.vue'
import dummyData from '@/components/announcementDummy.json'
import Parse from 'parse'

const store = useStore()
const router = useRouter()

// Data
const distanceFromTop = ref(true)
const isBanner = ref(true)

// Computed
const getHomeDialog = computed(() => store.getters.getHomeDialog)

// Methods
const setDataToArr = (payload) => store.dispatch('setDataToArr', payload)
const pushDataToArr = (payload) => store.dispatch('pushDataToArr', payload)

async function fetchSavedIcons() {
  if (!Parse.User.current()) {
    return
  }

  let savedIconsQuery = Parse.User.current().relation("favIcons").query()
  let userSavedIconData = await savedIconsQuery.descending("createdAt").find()

  let savedIconCount = await savedIconsQuery.count()
  setDataToArr({ arr: 'savedIconCount', data: savedIconCount })
  let savedIcons = userSavedIconData.map((icons) => icons)
  let iconsToShow = []

  savedIcons.forEach(icon => {
    let newIcon = {}
    for (let prop in icon.attributes) {
      newIcon[prop] = icon.attributes[prop]
    }
    newIcon.isSaved = true
    iconsToShow.push(newIcon)
    newIcon.id = icon.id
  })

  pushDataToArr({ data: iconsToShow, arr: "savedIcons" })
  return iconsToShow
}

function handleScroll() {
  let currentRoute = router.currentRoute.value.name
  let searchBar = document.getElementById("searchBar")
  if (currentRoute == "Home" && searchBar) {
    distanceFromTop.value = document.getElementById("searchBar").getBoundingClientRect().y > 65
  }
}

// Lifecycle
onMounted(() => {
  store.state.userData = Parse.User.current()
  // Toast is now handled by NuxtUI's useToast composable
})
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
