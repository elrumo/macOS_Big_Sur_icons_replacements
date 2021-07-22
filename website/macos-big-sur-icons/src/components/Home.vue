<template>
  <div>

    <deleteDialog :icon="activeIcon"/>

    <div v-if="overflow"> {{ toggleOverflow() }} </div>

    <StickyBanner/>

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
        class="main-search-wrapper coral-bg p-b-15"
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
                      <svg @click="clearSearch" class="icon p-t-20 p-b-20 p-r-10 p-l-10" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
                        <title>CrossLarge</title>
                        <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
                      </svg>

                      <div class="mobile-hidden" style="top: -26px;">
                        <button @click="copySearch" variant="quiet" is="coral-button">
                          Share search
                        </button>
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
                  @click="setCategory({id: 'All'})"
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
        search.length == 0 && searchString.length > 0 && getSelectedCategory.id == 'All'
      " class="waiting-wrapper">
        <p class="coral-Body--S">
          No results
        </p>
      </div>
      
      <!-- No Results for category-->
      <div v-if="
        search.length == 0 && searchString.length > 0 && getSelectedCategory.id != 'All'
      " class="waiting-wrapper">
        <p class="coral-Body--S">
          No results under {{ getSelectedCategory.name }}, try a different category
        </p>
      </div>

      <div class="main-content-wrapper content-wrapper-regular">
    
        <!-- Categories List -->
        <nav v-if="!isMobile" id="categoriesWrapper-desktop" class="mobile-hidden categories-sidenav coral-card" is="coral-sidenav">

          <!-- All Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.AllIcons"
            selected=""
            value="All"
            title="all"
            @click="setCategory({id: 'All'})"
          >
            All Icons
          </button>

          <!-- Featured Icons -->
          <!-- <button
            is="coral-sidenav-item"
            :icon="icons.Star"
            value="Featured"
            title="Featured"
            @click="setCategory({id: 'downloads'})"
          >
            Featured
          </button> -->
          
          <!-- Popular Icons -->
          <button
            is="coral-sidenav-item"
            :icon="icons.Flame"
            value="Featured"
            title="Featured"
            @click="setCategory({id: 'downloads'})"
          >
            Popular
          </button>
          
          <!-- Saved Icons -->
          <!-- <button
            is="coral-sidenav-item"
            :icon="icons.Heart"
            value="Saved"
            title="Saved"
            @click="setCategory({id: 'Saved'})"
          >
            Saved
          </button> -->

          <hr class="coral-Divider--S m-t-10 m-t-10">

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



        <!-- Icon list-->
        <div id="iconList" class="icon-list-area p-b-30 ">
          
          <!-- Ad -->
          <div style="min-height: 205px; max-height:240px" class="card-hover relative coral-card">
            
            <div style="z-index: 1; height: 100%; width: 100%" class="absolute carbon-card-ad">
              <script
              @click="adClick({position: 'Icon Grid Top', type: 'Carbon'})"
              async
              type="application/javascript"
              src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom"
              id="_carbonads_js"></script>
            </div>

            <div style="z-index: 2" class="absolute card-grid-nativeAd">
              <div
                @click="adClick({position: 'Icon Grid Top', type: 'Native'})"
                id="card-ad">
              </div>
            </div>
            
            <a
              class="card-no-ad relative"
              href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
              rel="noopener"
              target="_blank"
              style="width: 100%; left: 0;"
              @click="logDonation('support-message')"
            >
              <div class="support-page">
                <h3 class="coral-Heading--S m-0">
                  Support this page
                </h3>
                <p class="coral-Body--S m-0">
                  Please consider disabling your ad blocker or making a
                  <a  
                    rel="noopener"
                    class="coral-Link"
                    target="_blank"
                    href="https://www.paypal.com/donate/?hosted_button_id=5PMNX4DPW83KN"
                  >
                    donation 
                  </a>
                  to support this project.
                </p>
              </div>
            </a>

          </div>

          <UserIconCard v-for="icon in search" :key="icon.icnsUrl+icon.appName" :icon="icon" :isAdmin="isAdmin" :isMacOs="isMacOs"/>

          <div v-if="
              (!scrolledToBottom && getSelectedCategory.id != 'All') ||
              (!scrolledToBottom && searchString.length == 0 && getSelectedCategory.id == 'All')
            "
            class="waiting-wrapper"
          >
            <coral-wait size="L" indeterminate=""></coral-wait>
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
// import IconCard from './IconCard.vue';
import UserIconCard from './UserIconCard.vue';
import Dialog from './Dialog.vue';
import deleteDialog from './deleteDialog.vue';
import NativeAd from './NativeAd.vue';
import StickyBanner from './StickyBanner.vue';

// import algoliasearch from 'algoliasearch'
import Parse from 'parse'

import VueLoadImage from 'vue-load-image'

import dotenv from 'dotenv'; // Used to access env varaibles
dotenv.config()

// TODO: remove credentials

const VUE_APP_PARSE_APP_ID = process.env.VUE_APP_PARSE_APP_ID
const VUE_APP_PARSE_JAVASCRIPT_KEY = process.env.VUE_APP_PARSE_JAVASCRIPT_KEY

Parse.initialize(VUE_APP_PARSE_APP_ID, VUE_APP_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = 'https://media.macosicons.com/parse'

var Icons = Parse.Object.extend("Icons2");

const docLimit = 20

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
    'vue-load-image': VueLoadImage,
    StickyBanner
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
          // vmid:     'og:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'og:title',
          // vmid:     'og:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'og:description',
          // vmid:     'og:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
        },
        {
          property: 'og:image',
          // vmid:     'og:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail_2021.jpg'
        },

        // Twitter
        {
          property: 'twitter:url',
          // vmid:     'twitter:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'twitter:description',
          // vmid:     'twitter:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur & Monterey. Fully open source and community led. How to install custom icons on macOS Big Sur & Monterey.',
        },
        {
          property: 'twitter:title',
          // vmid:     'twitter:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'twitter:image',
          // vmid:     'twitter:image',
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
      today: "",

      downloads:{},

      iconListLen: 5_385,
      lastVisible: {},
      dataToShow: [],
      activeIcon: {},
      icons:{
        success: require("../assets/icons/delete.svg"),
        namingOrder: require("../assets/icons/namingOrder.svg"),
        date: require("../assets/icons/date.svg"),
        loading: require("../assets/placeholder-icon.png"),
        iconsOrder: require("../assets/icons/namingOrder.svg"),
        Browser_Extensions: require("../assets/icons/Category_Icons/Browser_Extensions.svg"),
        Browser_Extensions: require("../assets/icons/Category_Icons/Browser_Extensions.svg"),
        Developer_Tools: require("../assets/icons/Category_Icons/Developer_Tools.svg"),
        Education: require("../assets/icons/Category_Icons/Education.svg"),
        Entertainment: require("../assets/icons/Category_Icons/Entertainment.svg"),
        Finance: require("../assets/icons/Category_Icons/Finance.svg"),
        Games: require("../assets/icons/Category_Icons/Games.svg"),
        Graphics_Design: require("../assets/icons/Category_Icons/Graphics_Design.svg"),
        Health_Fitness: require("../assets/icons/Category_Icons/Health_Fitness.svg"),
        Lifestyle: require("../assets/icons/Category_Icons/Lifestyle.svg"),
        Medical: require("../assets/icons/Category_Icons/Medical.svg"),
        Music: require("../assets/icons/Category_Icons/Music.svg"),
        News: require("../assets/icons/Category_Icons/News.svg"),
        Photo_Video: require("../assets/icons/Category_Icons/Photo_Video.svg"),
        Productivity: require("../assets/icons/Category_Icons/Productivity.svg"),
        Reference: require("../assets/icons/Category_Icons/Reference.svg"),
        Social_Networking: require("../assets/icons/Category_Icons/Social_Networking.svg"),
        Sports: require("../assets/icons/Category_Icons/Sports.svg"),
        Travel: require("../assets/icons/Category_Icons/Travel.svg"),
        Utilities: require("../assets/icons/Category_Icons/Utilities.svg"),
        Weather: require("../assets/icons/Category_Icons/Weather.svg"),
        AllIcons: require("../assets/icons/Category_Icons/All_Icons.svg"),
        Star: require("../assets/icons/Category_Icons/Star.svg"),
        Heart: require("../assets/icons/Category_Icons/Heart.svg"),
        Flame: require("../assets/icons/Category_Icons/Flame.svg"),
      },
      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/placeholder-icon.png"),
        chevron: require("../assets/icons/ChevronDown.svg"),
      }
    }
  },

  mounted: function(){
    let parent = this;
    parent.getAd()
    const { getters } = parent.$store;
    let fullPath = parent.$route.fullPath
    
    let currentUser = Parse.User.current()

    if (fullPath.includes("/?username=") && !currentUser) {
      // let userName = fullPath.replace("/?username=", "")
      parent.showEl("loginDialog")
    }
    
    window.addEventListener('scroll', this.handleScroll);

    window.addEventListener('resize', () => {
      parent.windowWidth = window.innerWidth
    })

    // Get today's date
    ////////////////////////////////////////////////////////////////
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    parent.today = today;
    ////////////////////////////////////////////////////////////////

    let routerName = this.$router.currentRoute.name
    if(routerName == "Search"){
      let serachQuery = this.$router.currentRoute.params.search
      parent.searchString = serachQuery
    }

    // Parse.User.enableUnsafeCurrentUser()
    function handleParseError(err){
      switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
          Parse.User.logOut();
          loginParse()
          break;
      
        default:
          break;
      }
    }

    parent.getIconsArray();

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
        'scrollTo'
      ]),

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
      this.distanceFromTop =  document.getElementById("searchBar").getBoundingClientRect().y > 65
    },

    changeOS(e){
      let parent = this;
      if (e.target.value == "macOS") {
        parent.isMacOs = true
      } else{
        parent.isMacOs = false
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
      
      if (parent.$store.state.selectedCategory.id != "All") {

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
      query.equalTo("approved", true)
      query.descending("timeStamp");
      query.skip(howManyRecords);
      query.limit(docLimit);
      const results = await query.find()
      
      parent.scrolledToBottom = true
      
      let allIcons = []

      for(let result in results){
        let objData = results[result].attributes
        let iconData = {}

        for(let data in objData){
          iconData[data] = objData[data]
        }
        iconData.id = results[result].id;
        
        allIcons.push(iconData)
      }

      parent.$store.dispatch("pushDataToArr", {data:  allIcons, arr: "list", concatArray: true});
    },

    scroll() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000
        
        // console.log(bottomOfWindow && parent.scrolledToBottom);
        // console.log(bottomOfWindow);

        if (bottomOfWindow && parent.scrolledToBottom) {
          parent.scrolledToBottom = false
          parent.loadMore()
        }
      }
    },

    async getIconsArray(){
      let parent = this

      function handleParseError(err){
        console.log("Error getting icons, this eror this @elrumo: ", err.code);
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
      }

      try {
        const query = new Parse.Query(Icons);
        query.equalTo("approved", true);
        query.descending("timeStamp");
        query.exists("icnsFile");
        query.limit(docLimit);
        parent.howManyRecords = docLimit
        const results = await query.find()

        query.count().then((count) =>{
          parent.iconListLen = count
        })
        
        // console.log("2");
        parent.setData({state: 'list', data: []})
        
        var userInfo = {}
        
        var allIcons = []
        for(let result in results){

          let iconItem = results[result]

          let objData = iconItem.attributes
          let iconData = {}

          for(let data in objData){
            iconData[data] = objData[data]
          }
          iconData.id = results[result].id
          
          allIcons.push(iconData)
        }
        parent.$store.dispatch("pushDataToArr", {data:  allIcons, arr: "list", concatArray: true});
        
        // Gets up to date info about the user
        let data = {
          howManyRecords: 0,
          results: results
        }
        // parent.fetchIconUserInfo(data)

        var attempts = 0;

        function getAd (){
          setTimeout(() => {
            let carbon = document.getElementById("carbonads")
            if (attempts >= 4) return;
            try {
              carbon.classList.add("")
            } catch (error) {
              attempts++
              getAd()
              parent.isAdOn = true
            }
          }, 500);
        }

        getAd()

        parent.scroll()

      } catch (error) {
        handleParseError(error)
        console.log("865 - Error loading icons, this eror this @elrumo: ", error);
      }

    },

    showDialog(dialogId, icon){
      let parent = this
      parent.activeIcon= icon
      document.getElementById(dialogId).show()
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
    searchString: function (search) {
      let parent = this

      parent.setData({state: "searchString", data: search})

      if (parent.$route.name != "Home" && parent.$route.name != "Search") {
        return
      }
      parent.algoliaSearch()
    },

    content() {
      this.$nextTick(()=>{
        let parent = this
        let ad = document.getElementById("carbonads")
        if(!ad) {
          parent.isAdOn = false
        } else {
          parent.isAdOn = false
        }
      })
    }
  },

  computed:{
    ...mapGetters(['getUser', 'getAppCategories', 'getIconType', 'selectedIcons', 'getSelectedCategory']),

    isMobile(){
      let parent = this;
      // console.log("this.windowWidth: ", this.windowWidth);
      return parent.windowWidth <= 820
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

  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },

  props: {
  }
}
</script>

<style lang="less">
  // @import url(coral.css);
  @import url(app.less);
  @import url(snack-helper.min.css);
  @import url(carbon.css);

  .paypal-wrapper{
    margin-top: 20px;
    background: white;
    padding: 20px;
    border-radius: 7px;
  }


</style>
