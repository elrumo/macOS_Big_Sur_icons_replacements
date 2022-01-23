<template>
  <div>
    <deleteDialog :icon="!activeIcon"/>

    <div v-if="overflow"> {{ toggleOverflow() }} </div>

    <!-- <StickyBanner/> -->
    <SaveIconsDialogue v-if="!isAuth"/>

    <!-- <coral-dialog id="newDialog" open style="text-align: left;">
      <coral-dialog-header>Pay to view</coral-dialog-header>
      
      <coral-dialog-content style="max-width: 350px">
        <p class="coral-Body--M">
          Unfortunately this website will now be only accessible through a one time purchase of $9.99.
          <br>
          <br>
          <router-link class="coral-Link" to="/blog/new-paid-access">
            <b>Read the blog to learn more.</b>
          </router-link>
        </p>
      </coral-dialog-content>

      <coral-dialog-footer>
        <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
            <a rel="noopener"
              class="coral-Link"
              href="https://py.pl/UKrQC"
              target="_blank"
              @click="logDonation('pass-dialog')"
            >
          <button is="coral-button" variant="CTA">
              Purchase pass
          </button>
            </a>
      </coral-dialog-footer>
    </coral-dialog> -->

    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submissionDialog'"
      :iconListLen="iconListLen"
      :parseObj="getParseObj"
      :iconsEmpty="true"
    />

    
    <section style="min-height: calc(100vh - 120px);" class="">
      
      <!-- Search bar -->
      <div
        @click="isSearch = true"
        id="searchBar"
        class="main-search-wrapper coral-bg p-b-16"
        :class="{'scrolled-shadow': !distanceFromTop}"
      >

        <!-- Search box-->
        <div>
          <div @click="scrollTo" class="content-wrapper-regular search">
            <div class="m-auto main-search" style="max-width:300px;">
              <div class="shadow main-border-radius">
                <input 
                  v-model="searchString" 
                  :placeholder="'Search ' + iconListLen + ' icons'" 
                  type="text"  
                  id="searchBarInput"
                  class="_coral-Search-input _coral-Textfield searchBar" 
                  name="name" 
                  aria-label="text input"
                >
                
                <!-- Search icon -->
                <svg class="icon searchBar-left" id="coral-css-icon-Magnifier" viewBox="0 0 16 16">
                  <path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path>
                </svg>
                
                <!-- Cross icon -->
                <transition name="fade">
                  <div v-if="searchString" class="searchBar-right">
                    
                    <div class="searchBar-right-wrapper">
                      <svg @click="clearSearch" class="icon p-t-24 p-b-24 p-r-8 p-l-8" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
                        <title>CrossLarge</title>
                        <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
                      </svg>

                      <div class="mobile-hidden" style="top: -26px;">
                        <button @click="copySearch" variant="quiet" is="coral-button">
                          Share search
                        </button>
                      </div>
                    </div>

                  </div>
                </transition>
                
                <hr class="coral-Divider--s coral-Divider--vertical searchBar-divider m-0">

                <div class="dropdown-select-chevron">
                  <select
                  id="selectOS"
                  class="dropdown-select searchbar-select"
                  v-on:change="changeOS"
                  >
                    <option value="macOS" selected="">
                      macOS
                    </option>
                    <option value="iOS">
                      iOS
                    </option>
                  </select>
                </div>

              </div>
            </div>
          </div>
        </div>

         <div v-if="isMobile" class="desktop-hidden categories-container">
          <div id="categoriesWrapper-mobile" class="categories-wrapper">
            <coral-buttongroup selectionmode="single">
                <button
                  is="coral-button"
                  selected="true"
                  value="All"
                  title="all"
                  @click="setCategory({name: 'All'})"
                  aria-label="category.name  "
                >
                  All icons
                </button>
                <button
                  v-for="category in getAppCategories"
                  :key="category.name+'_categoryHome'"
                  is="coral-button"
                  selected=""
                  @click="setCategory(category)"
                  :value="category.name"
                  :title="category.name"
                  :aria-label="category.name  "
                >
                  {{category.name}}
                </button>
            </coral-buttongroup>
          </div>
          <div @click="scrollEl('categoriesWrapper', 0, -300)" class="click-to-scroll scroll-left chevron" :src="coralIcons.chevron" alt=""/>
          <div @click="scrollEl('categoriesWrapper', 0, 300)" class="click-to-scroll scroll-right chevron" :src="coralIcons.chevron" alt=""/>
        </div>
      </div> 

      <!-- Loading error -->
      <div v-if="false" class="waiting-wrapper">
        <NativeAd :adPosition="'Loading error'" :adId="'iconbar-js-card-grid'" :key="$route.fullPath + 'ad'"/>
        <h3 class="coral-Heading--M">
          The site is temporarily down for maintenance purposes.
          <br>
        </h3>
        <h3 class="coral-Heading--S coral-Heading--light">
          Check again in a few minutes or follow me on
            <a rel="noopener"
              class="coral-Link"
              href="https://twitter.com/elrumo"
              target="_blank"
            >
              Twitter
            </a>
          to stay up to date.
        </h3>
      </div>
      
      <!-- No Results -->
      <div v-if="
          search.length == 0
          && searchString.length > 0
          && (
            getSelectedCategory.name == 'All'
            || getSelectedCategory.name == 'downloads' // downloads = Popular
          )
        "
        class="waiting-wrapper"
      >
        <p class="coral-Body--S">
          No results for <b>{{ searchString }}</b>
        </p>
      </div>

      <!-- No Results for category-->
      <div
        v-if="
          search.length == 0
          && searchString.length > 0
          && getSelectedCategory.name != 'All'
          && getSelectedCategory.name != 'Saved'
          && getSelectedCategory.name != 'downloads' // downloads = Popular
        "
        class="waiting-wrapper"
      >
        <div v-if="
          getSelectedCategory.nameid != 'Saved'
          && searchString.length > 0
        ">
          <p class="coral-Body--S">
            No results for <b>{{ searchString }}</b> in {{ getSelectedCategory.name }}. Try a different category.
          </p>
        </div>
      </div>
      
      <!-- No results for saved icons -->
      <div
        v-if="
          getSelectedCategory.name == 'Saved' && search.length == 0
        "
        class="waiting-wrapper"
      >
       <div v-if="isUserLoggedIn">
          <div
            v-if="
              search.length == 0
              && searchString.length == 0
            "
          >
            <p class="coral-Body--S">
              You haven't saved any icons yet, give it a go!
            </p>
          </div>
          
          <div v-if="
            searchString.length != 0
            && search.length == 0
            "
          >
            <p class="coral-Body--S">
              We cound not find <b>{{ searchString }}</b> in your Saved icons.
            </p>
          </div>
        </div>

        <div v-else-if="
          getSelectedCategory.name == 'Saved'
          && !isUserLoggedIn
        ">
          <p class="coral-Body--S">
            To save icons, you need to
            <a class="cursor-pointer" @click="showDialog('loginDialog')">
              login
            </a> or
            <a class="cursor-pointer" @click="showDialog('loginDialog')">
              create
            </a> 
            an account first.
          </p>
        </div>
      </div>

      <!-- Main area -->
      <div class="main-content-wrapper content-wrapper-regular">
        
        <!-- Categories List -->
        <nav
          v-if="!isMobile"
          id="categoriesWrapper-desktop"
          class="mobile-hidden categories-sidenav coral-card" is="coral-sidenav"
        >

          <!-- All Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.AllIcons"
            selected=""
            value="All"
            title="all"
            @click="setCategory({name: 'All'})"
          >
            All Icons
          </button>

          <!-- Featured Icons -->
          <!-- <button
            is="coral-sidenav-item"
            :icon="icons.Star"
            value="Featured"
            title="Featured"
            @click="setCategory({name: 'downloads'})"
          >
            Featured
          </button> -->
          
          <!-- Popular Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.Flame"
            value="Featured"
            title="Featured"
            @click="setCategory({name: 'downloads'})"
          >
            Popular
          </button>
          
          <!-- Saved Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.Heart"
            value="Saved"
            title="Saved"
            @click="setCategoryAndFetchSaved()"
          >
            Saved
          </button>

          <hr class="coral-Divider--S m-t-8 m-t-8">

          <button
            :icon="icons[category.name.replaceAll(' ', '_').replace('&_', '')]"
            v-for="category in getAppCategories"
            :key="category.name+'_categoryHome'"
            is="coral-sidenav-item"
            @click="setCategory(category)"
            :value="category.name"
            :title="category.name"
            :aria-label="category.name"
          >
            {{category.name}}
          </button>

          <div class="gradient-categories-navbar" />
        </nav>


        <!-- Icon grid-->
        <div>
          <div
          v-if="
            searchString.length == 0
            && search.length == 0
            && getSelectedCategory.name != 'Saved'
          "
            class="icon-list-area loading p-b-32"
          >
            <UserIconCardLoading
              v-for="num in 30"
              :key="num+Math.floor(Math.random() * 10000000 + 1)"
            />
          </div>

          <div 
            v-else
            id="iconList" 
            class="p-b-32 icon-list-area"
          >

              <CarbonAd
                adId="homePage"
              />
              
              <UserIconCard
                v-for="icon in search"
                :key="icon.id+icon.appName+getSelectedCategory.name"
                :icon="icon"
                :isAdmin="isAdmin"
                :isMacOs="isMacOs"
              />

          </div>
        </div>


      </div>


    </section>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Header from './Header.vue';
import Hero from './Hero.vue';
import UserIconCard from './UserIconCard.vue';
import Dialog from './Dialog.vue';
import deleteDialog from './deleteDialog.vue';
import NativeAd from './NativeAd.vue';
import StickyBanner from './StickyBanner.vue';
import CarbonAd from './CarbonAd.vue';
import UserIconCardLoading from './UserIconCardLoading.vue';
import SaveIconsDialogue from './SaveIconsDialogue.vue';


import Parse from 'parse/dist/parse.min.js';

// TODO: remove credentials
const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = 'https://media.macosicons.com/parse'

var Icons = Parse.Object.extend("Icons2");

const docLimit = 20

import deleteIcon from "../assets/icons/delete.svg"
import namingOrderIcon from "../assets/icons/namingOrder.svg"
import dateIcon from "../assets/icons/date.svg"
import placeholderIcon from "../assets/placeholder-icon.png"
import BrowserExtensionsIcon from "../assets/icons/Category_Icons/Browser_Extensions.svg"
import DeveloperToolsIcon from "../assets/icons/Category_Icons/Developer_Tools.svg"
import EducationIcon from "../assets/icons/Category_Icons/Education.svg"
import EntertainmentIcon from "../assets/icons/Category_Icons/Entertainment.svg"
import FinanceIcon from "../assets/icons/Category_Icons/Finance.svg"
import GamesIcon from "../assets/icons/Category_Icons/Games.svg"
import Graphics_DesignIcon from "../assets/icons/Category_Icons/Graphics_Design.svg"
import HealthFitnessIcon from "../assets/icons/Category_Icons/Health_Fitness.svg"
import LifestyleIcon from "../assets/icons/Category_Icons/Lifestyle.svg"
import MedicalIcon from "../assets/icons/Category_Icons/Medical.svg"
import MusicIcon from "../assets/icons/Category_Icons/Music.svg"
import NewsIcon from "../assets/icons/Category_Icons/News.svg"
import PhotoVideoIcon from "../assets/icons/Category_Icons/Photo_Video.svg"
import ProductivityIcon from "../assets/icons/Category_Icons/Productivity.svg"
import ReferenceIcon from "../assets/icons/Category_Icons/Reference.svg"
import SocialNetworkingIcon from "../assets/icons/Category_Icons/Social_Networking.svg"
import SportsIcon from "../assets/icons/Category_Icons/Sports.svg"
import TravelIcon from "../assets/icons/Category_Icons/Travel.svg"
import UtilitiesIcon from "../assets/icons/Category_Icons/Utilities.svg"
import WeatherIcon from "../assets/icons/Category_Icons/Weather.svg"
import AllIconsIcon from "../assets/icons/Category_Icons/All_Icons.svg"
import StarIcon from "../assets/icons/Category_Icons/Star.svg"
import HeartIcon from "../assets/icons/Category_Icons/Heart.svg"
import FlameIcon from "../assets/icons/Category_Icons/Flame.svg"

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import ChevronDownCoralIcon from "../assets/icons/ChevronDown.svg"

export default {
  name: 'Home',

  components: {
    Header,
    Hero,
    // IconCard,
    Dialog,
    deleteDialog,
    NativeAd,
    UserIconCard,
    StickyBanner,
    CarbonAd,
    UserIconCardLoading,
    SaveIconsDialogue,
  },

  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      // title: 'How to change app icons in macOS Big Sur & Monterey',
      title: 'macOS app icon pack - 7000+ ready icons for Big Sur & iOS',
      // description:"Instructions on how to donlwoad and change app icons in macOS Big Sur & Monterey using Finder and a website with over 5000+ free app icons.",
      description:"7000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'og:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'og:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
        },
        {
          property: 'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'twitter:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
        },
        {
          property: 'twitter:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
        },
      ]
  },

  data(){
    return{

      Icons: Icons,
      Parse: Parse,

      iconList:{},
      searchString: "",
      awaitingSearch: false,
      iconsToShow: [],
      list: [],
      
      overflow: true,
      windowWidth: window.innerWidth,
      scrolledToBottom: true,
      sortByName: true,
      sortBy: "createdAt",
      isSearch: false,
      noIcons: true,
      isAuth: false,
      loadingError: false,
      
      howManyRecords: 0,

      isMacOs: true,
      isAdOn: false,

      scrolled: false,
      distanceFromTop: true ,

      message: "",
      today: this.getTodayDate(),

      downloads:{},

      iconListLen: 5_385,
      lastVisible: {},
      dataToShow: [],
      activeIcon: {},
      
      icons:{
        success: deleteIcon,
        namingOrder: namingOrderIcon,
        date: dateIcon,
        loading: placeholderIcon,
        iconsOrder: namingOrderIcon,
        Browser_Extensions: BrowserExtensionsIcon,
        Developer_Tools: DeveloperToolsIcon,
        Education: EducationIcon,
        Entertainment: EntertainmentIcon,
        Finance: FinanceIcon,
        Games: GamesIcon,
        Graphics_Design: Graphics_DesignIcon,
        Health_Fitness: HealthFitnessIcon,
        Lifestyle: LifestyleIcon,
        Medical: MedicalIcon,
        Music: MusicIcon,
        News: NewsIcon,
        Photo_Video: PhotoVideoIcon,
        Productivity: ProductivityIcon,
        Reference: ReferenceIcon,
        Social_Networking: SocialNetworkingIcon,
        Sports: SportsIcon,
        Travel: TravelIcon,
        Utilities: UtilitiesIcon,
        Weather: WeatherIcon,
        AllIcons: AllIconsIcon,
        Star: StarIcon,
        Heart: HeartIcon,
        Flame: FlameIcon,
      },
      coralIcons:{
        delete: deleteIcon,
        addIcon: addCoralIcon,
        newItem: newItemCoralIcon,
        edit: editCoralIcon,
        loading: placeholderCoralIcon,
        chevron: ChevronDownCoralIcon,
      }
    }
  },

  mounted: async function(){
    this.getAd()
    this.cmdK()
    this.searchForPathQuery()
    this.setEventListenersOnStart()
    this.fetchUserAttributes()

    this.isAuth = this.getUser.isAuth
    
    try {
      // await this.fetchSavedIcons()
      this.getIconsArray();
    } catch (error) {
      console.log("error: ", error);
    }

    let fullPath = this.$route.fullPath
    let currentUser = Parse.User.current()
    if (fullPath.includes("/?username=") && !currentUser) {
      this.showEl("loginDialog")
    }
  },

  methods:{ 
    ...mapActions([
      'showToast',
      'showEl',
      'fetchIconUserInfo',
      'adClick',
      'setCategory',
      'setData',
      'loadMoreIcons',
      'algoliaSearch',
      'scrollTo',
      'setDataToArr',
      'pushDataToArr',
      'fetchUserAttributes',
      'fetchSavedIcons'
    ]),

    setEventListenersOnStart(){
      window.addEventListener('scroll', this.handleScroll);

      window.addEventListener('resize', (data) => {
        parent.windowWidth = window.innerWidth
      })
    },

    searchForPathQuery(){
      let routerName = this.$route.name
      if(routerName == "Search"){
        let serachQuery = this.$router.currentRoute.params.search
        this.searchString = serachQuery
      }
    },

    removeButton() {
    },

    getTodayDate(){
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
      return today
    },

    cmdK(){
      document.addEventListener('keydown', (event) => {
        let isCmdkPressed = event.getModifierState('Meta') && event.key.toLowerCase() == 'k'

        if(isCmdkPressed){
          document.getElementById('searchBarInput').focus()
          document.getElementById('searchBarInput').click();
        }

      });
    },

    async setCategoryAndFetchSaved(){
      this.setCategory({name: 'Saved'})
    },

    scrollEl(id, top, left){
      let scrollLeft = document.getElementById(id).scrollLeft
      let scrollTop = document.getElementById(id).scrollTop

      document.getElementById(id).scroll({
        top: scrollTop+top,
        left: scrollLeft+left,
        behavior: 'smooth'
      })
    },

    getAd(el){
      try {
        if (typeof _bsa !== 'undefined') {
          _bsa.init('custom', 'CESDC2QN', 'placement:macosiconscom',
          {
            target: '#card-ad',
            template: `
                <a href="##statlink##" target="_blank" rel="noopener sponsored" id="customAd" class="bsa-link">
                <div class="bsa-img-wrapper" style="background-color: ##backgroundColor##;">
                  <div class="bsa-icon" style="background-image: url(##logo##);"></div>
                </div>
                <div class="text-ad-wrapper">
                  <img style="background: ##backgroundColor##" src="##image##">
                  <div class="bsa-desc">##description##</div>
                </div>
                </a>
              `
            }
          );
        }
      } catch (error) {
      }
    },

    isDialog(){
      console.log(document.getElementByTagName("coral-dialog").open);
      return true;
    },

    toggleOverflow(){
      document.documentElement.style.overflow = '';
    },

    logDonation(location){
      window.plausible("logDonation", {props: {
          location: location, 
      }})
    },

    async copySearch(){
      let parent = this;
      let toCopy = "https://macosicons.com/" + parent.searchString
      
      await navigator.clipboard.writeText(toCopy);
      
      parent.showToast({
        id: "toastMessage",
        message: "✅ Link copied to your clipboard",
        variant: "success"
      })

      window.plausible("PageShared", {props: {
        sharedTerm: parent.searchString,
        date: parent.today,
      }})
    },

    clearSearch(){
      this.searchString = ""
    },

    handleScroll () {
      let searchBar = document.getElementById("searchBar")
      if(!searchBar) return 
      this.distanceFromTop =  document.getElementById("searchBar").getBoundingClientRect().y > 65
    },

    changeOS(e){
      if (e.target.value == "macOS") {
        this.isMacOs = true
      } else{
        this.isMacOs = false
      }
    },

    downladUrl(icon){
      let parent = this
      
      if (parent.isMacOs) {
        return icon.icnsUrl
      } else {
        return icon.iOSUrl
      }
    },

    async addClickCount(icon){
      let parent = this

      var id

      if (icon.id) {
        id = icon.id
      } else{
        id = icon.objectID
      }
      icon = { appName: icon.appName, id: id }
      await Parse.Cloud.run("addClickCount", {icon: icon})
    },

    prettifyName(name){
      name = name.replaceAll("_", " ")
      return name
    },

    changeSortOrder(){
      let parent = this
      let sortByName = parent.sortByName
      let date = parent.icons.date
      let namingOrder = parent.icons.namingOrder
      
      console.log(sortByName);

      if (parent.sortByName) {
        parent.icons.iconsOrder = date
      } else{
        parent.icons.iconsOrder = namingOrder
      }

      parent.sortByName = !parent.sortByName
      
    },
    
    getDate(timeStamp){
      let newDate = new Date(timeStamp)
      
      let day = newDate.getUTCDate()
        if (day < 10) {
          day = "0"+day
        }
      let month = newDate.getUTCMonth() + 1
        if (month < 10) {
          month = "0"+month
        }
      let year = newDate.getFullYear()
      let date = day + "/" + month + "/" + year

      return date
    },

    async loadMore(){
      let parent = this
      
      if (parent.$route.path != "/") {
        return
      }
      
      if (parent.$store.state.selectedCategory.name != "All") {

        if (parent.$store.state.totalCategory == parent.selectedIcons.length) {
          parent.scrolledToBottom = true
          return
          setTimeout(() => {
          }, 800)
        } else{
          setTimeout(() => {
            parent.loadMoreIcons()
            parent.scrolledToBottom = true
          }, 800)
          return
        }

      }

      let howManyRecords = parent.howManyRecords
      
      parent.howManyRecords = howManyRecords + docLimit

      const query = new Parse.Query(Icons);
      query.equalTo("isHidden", false)
      query.equalTo("approved", true)
      query.include("user");
      query.descending("timeStamp");
      query.skip(howManyRecords);
      query.limit(docLimit);
      const results = await query.find()
      
      parent.scrolledToBottom = true
      
      let allIcons = []

      for(let result in results){
        let iconItem = results[result].attributes
        if (iconItem.user.attributes.isBanned || iconItem.isHidden) continue
        
        let iconData = {}
        for(let data in iconItem){
          iconData[data] = iconItem[data]
        }

        iconData.id =  results[result].id;
        allIcons.push(iconData)
      }

      parent.$store.dispatch("pushDataToArr", {data:  allIcons, arr: "list", concatArray: true});
    },

    scroll() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

        if (bottomOfWindow && parent.scrolledToBottom) {
          parent.scrolledToBottom = false
          parent.loadMore()
        }
      }
    },

    handleParseError(err){
      const parent = this

      console.log("Error getting icons, report this error to @elrumo: ", err);
      switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
          Parse.User.logOut();
          window.location.reload()
          break;
        
        case 100:
          break;
      
        default:
          parent.loadingError = "true"
          break;
      }
    },

    async getIconsArray(){
      let parent = this
      
      const query = new Parse.Query(Icons);

      query.descending("timeStamp");
      query.equalTo("isHidden", false);
      query.equalTo("approved", true);
      query.exists("icnsFile");
      query.include(["user.isBanned"]);
      query.limit(docLimit);
      parent.howManyRecords = docLimit

      const results = await query.find()

      query.count().then((count) =>{
        parent.iconListLen = count
      })

      
      parent.setData({state: 'list', data: []})
      var allIcons = []

      // Save savedIcons IDs to array to compare them to fetched icons
      let savedIconsId = parent.getSavedIcons.map(({id}) => id )
      
      try{
        for(let result in results){
          let iconId = results[result].id
          let iconItem = results[result].attributes

          if (iconItem.user.attributes.isBanned || iconItem.isHidden) continue
          let iconData = {}

          for(let data in iconItem){
            iconData[data] = iconItem[data]
          }
          iconData.id = iconId

          // Check if icon has been saved by the user
          iconData.isSaved = savedIconsId.includes(iconData.id);
          
          allIcons.push(iconData)
        }
        parent.$store.dispatch("pushDataToArr", {data:  allIcons, arr: "list", concatArray: true});
      } catch (error) {
        console.log('ERROR: ', error);
      }
      
      // Gets up to date info about the user
      let data = {
        howManyRecords: 0,
        results: results
      }

      var attempts = 0;

      parent.scroll()

    },

    showDialog(dialogId){
      let parent = this
      document.getElementById(dialogId).show()
      // parent.activeIcon= icon
    },

    async editDoc(icon, e, field){
      let newName = e.target.value
      
      let id
      if (icon.algoliaID == undefined) {
          id = icon.id
      } else {
          id = icon.algoliaID
      }

      console.log(icon);
      console.log(id);

      const IconsBase = Parse.Object.extend("Icons2");
      const query = new Parse.Query(IconsBase);
      const docToEdit = await query.get(id)


      docToEdit.set({ [field]: newName }) // Save icnsToStore obj with .icns file and its url to Parse server
      docToEdit.save().then(() =>{
        console.log(field, "updated.");
      }).catch((e) =>{
        document.getElementById("error").show()
      })

    },

    changeDate(icon, e){
        let date = e.target.value
        console.log(icon);
        
        // Get new input date and convert it to Unix miliseconds
        let day = date[0]+date[1]
        let month = date[3]+date[4]
        let year = date[6]+date[7]+date[8]+date[9]

        let newDate = new Date(month + "/" + day + "/" + year)
        let newTimeStamp = newDate.getTime()

        console.log(newDate);
        console.log(newTimeStamp);

        db.collection("submissions").doc(icon.id).update({
            timeStamp: newTimeStamp
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      },

  },

  watch:{

    // searchQuery: _.debounce(function() {
    //   this.isTyping = false;
    // }, 1000),
    // isTyping: function(value) {
    //   if (!value) {
    //     this.searchUser(this.searchQuery);
    //   }
    // },

    searchString: {
      handler(val, oldVal) {
        if (this.$route.name != "Home" && this.$route.name != "Search") return;

        if (val == '') this.setData({state: "searchString", data: val}); // Don't wait 500ms before showing empty search results


        // if (!this.awaitingSearch && val != '') {
          this.setData({state: "searchString", data: val})
          this.algoliaSearch()
          
        //   setTimeout(() => {
        //     this.setData({state: "searchString", data: val})
        //     this.algoliaSearch()
        //     this.awaitingSearch = false;
        //   }, 500); // 1 sec delay
        // }

        // this.awaitingSearch = true;
      },
      deep: true
    },

    content: {
      handler(val, oldVal) {
        this.$nextTick(()=>{
          let parent = this
          let ad = document.getElementById("carbonads")
          if(!ad) {
            parent.isAdOn = false
          } else {
            parent.isAdOn = false
          }
        })
      },
      deep: true
    }
  },

  computed:{
    ...mapGetters([
      'getUser', 
      'getAppCategories', 
      'getIconType', 
      'selectedIcons', 
      'getSelectedCategory', 
      'getSavedIcons',
      'getSupportMessage'
    ]),

    isMobile(){
      let parent = this;
      // console.log("this.windowWidth: ", this.windowWidth);
      return this.windowWidth <= 820
    },
    
    adIsOn(){
      let ad = document.getElementById("carbonads")
      if(!ad) {
        return true
      } else {
       return false
      }
    },

    isAdmin(){
      let parent = this

      if (parent.getUser.isAuth) {
        if (parent.getUser.userData.Role.objectId == "OoxWjSJuQi") {
          return true
        } else { return false }

      } else{
         return false
      }
    },

    async getTotalRestore(){
      // let numIcons = await query.count()
      // const query = new Parse.Query(Icons)
      // query.exists("icnsFile")
      // console.log(numIcons);
    },

    getParseObj(){
      return Icons
    },

    toastMsg(){
      return this.$store.state.toastMsg
    },

    search(){
      let parent = this

      if(parent.selectedIcons.length == 0){
        parent.noIcons = true
      } else{
        parent.noIcons = false
      }
      
      // If searchString is empty (no search by the user), return the full list of icons
      if(!parent.searchString || parent.searchString.length == 0){
        parent.isSearch = false 
        return parent.selectedIcons
      }

      return parent.selectedIcons
      // return parent.$store.state.dataToShow
    },

    iconListStore(){
      return this.$store.state.list
    },

    isUserLoggedIn(){
      if (Parse.User.current()) return true
      else return false
    }

  },

  unmounted () {
    // window.removeEventListener('scroll', this.handleScroll);
  },

  props: {
  }
}
</script>

<style lang="scss">
  // @import url(coral.css);
  @import 'app.scss';
  @import 'snack-helper.min.css';
  @import 'carbon.scss';

  .paypal-wrapper{
    margin-top: 20px;
    margin-top: 20px;
    background: white;
    padding: 20px;
    border-radius: 7px;
  }


</style>
