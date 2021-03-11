<template>
  <div>
    
    <!-- <Dialog/> -->
    <deleteDialog :icon="activeIcon" :Icons="Icons" :Parse="Parse"/>

    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submitIcon'"
      :iconListLen="iconListLen"
      :iconsEmpty="!loadingError"
      :parseObj="getParseObj"
    />

    <coral-toast id="errorToast" variant="error">
      {{ toastMsg }}
    </coral-toast>

    <coral-toast id="successToast" variant="success">
      😄 All icons have been uploaded.
    </coral-toast>

    <coral-toast id="successMessage" variant="success">
      {{ message }}
    </coral-toast>

    <coral-toast id="iconUpdated" variant="success">
      All icons have been updated
    </coral-toast>

    <coral-toast id="iconApproved" variant="success">
      Icon has been approved
    </coral-toast>

    <coral-toast id="approveError" variant="error">
      There has been an error, please Approve again
    </coral-toast>


    <!-- <div style="display: none"> {{search}} </div> -->
    <!-- Icon Section -->
    <section class="">
    <!-- Search bar -->
    
      <div
        v-if="!loadingError"
        @click="isSearch = true"
        id="searchBar"
        class="main-search-wrapper coral-bg p-b-15"
        :class="{'scrolled-shadow': !distanceFromTop}"
      >
        <div class="content-wrapper-regular search">
          
          <div class="m-auto main-search" style="max-width:300px;">
            <div class="shadow main-border-radius">
              <input v-model="searchString" :placeholder="'Search ' + iconListLen + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
              
              <!-- Search icon -->
              <svg class="icon searchBar-left" id="coral-css-icon-Magnifier" viewBox="0 0 16 16">
                <path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path>
              </svg>
              
              <!-- Cross icon -->
              <transition name="fade">
                <div v-if="searchString" class="searchBar-right">
                    <svg @click="clearSearch" class="icon " xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 12 12" width="12">
                      <title>CrossLarge</title>
                      <rect id="ToDelete" fill="#ff13dc" opacity="0" width="12" height="12" /><path d="M11.69673,10.28266,7.41406,6l4.28267-4.28266A.9999.9999,0,1,0,10.28266.30327L6,4.58594,1.71734.30327A.9999.9999,0,1,0,.30327,1.71734L4.58594,6,.30327,10.28266a.9999.9999,0,1,0,1.41407,1.41407L6,7.41406l4.28266,4.28267a.9999.9999,0,1,0,1.41407-1.41407Z" />
                    </svg>

                    <!-- <div class="mobile-hidden"> -->
                      <button class="mobile-hidden" @click="copySearch" is="coral-button">
                        Share search
                      </button>
                    <!-- </div> -->

                </div>
              </transition>

            </div>
          </div>

          <div @click="changeOS" class="switch-wrapper coral-card shadow main-border-radius">
            <div id="macOStext" class="switch-text">
              macOS
            </div>
            <div id="iOStext" class="switch-text text-not-selected">
              iOS
            </div>
            <div id="osSwitcher" class="switch-btn"></div>
          </div>
        </div>
      </div>
      
    <!-- Loading spinning circle -->
      <div v-if="this.$store.state.list == 0 & !loadingError" class="waiting-wrapper">
        <coral-wait size="L" indeterminate=""></coral-wait>
      </div>

    <!-- Loading error -->
      <div v-if="loadingError" class="waiting-wrapper">

        <h3 class="coral-Heading--M">
          The site is temporarily down for maintenance purposes.
          <br>
        </h3>
        <h3 class="coral-Heading--S coral-Heading--light">
          Check again in a few minutes or follow me on
            <a rel="noopener" class="coral-Link"
              href="https://twitter.com/elrumo"
              target="_blank"
            >
              Twitter
            </a>
          to stay up to date.
        </h3>
      </div>

      <div v-if="noIcons" class="waiting-wrapper">
        <p class="coral-Body--S">
          No results
        </p>
      </div>

      <button v-if="isAuth" @click="logout" is="coral-button" variant="quiet">
        Logout
      </button>

    <!-- Icon list when Auth-->
        <div v-if="isAuth & !loadingError" class="icon-list-area p-t-20 p-b-50 content-wrapper-regular">
          
          <!-- Icons -->
          <div  v-for="icon in search" :key="icon.icnsUrl" class="card-wrapper coral-card">
              <div class="card-img-wrapper" style="max-width: 120px;">
                
                <a rel="noopener" v-if="isMacOs" :href="icon.icnsUrl">
                  <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :alt="icon.appName +' icon'" :data-src="icon.lowResPngUrl">
                  </div>
                </a>

                <a rel="noopener" v-else :href="icon.iOSUrl">
                  <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :alt="icon.appName +' icon'" :data-src="icon.lowResPngUrl">
                  </div>
                </a>

                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="showDialog('deleteDialog', icon)" class="h-full quick-action-icon" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>
                  
              </div>

              <div class="card-text-wrapper p-l-15 p-r-15 p-b-15">

                  <p class="coral-Body--XS opacity-60 m-b-0">
                    <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                  </p>
                  <h3 class="coral-font-color m-b-0">
                    <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName')" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                  </h3>

                  <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                  <p class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input"></p>
                  <div v-if="icon.email != 'user@email.com' && icon.email " class="p-t-10"> 
                    <a rel="noopener" class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission&body='+icon.usersName">
                          email
                    </a>
                  </div>
              </div>
          </div>
        </div>

    <!-- Seen when no auth  -->
        <div v-if="!isAuth & !loadingError" class="icon-list-area p-t-20 p-b-50 content-wrapper-regular">

          <!-- Carbon ads -->
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>

          <a
            rel="noopener"
            v-for="icon in search"
            :key="icon.lowResPngUrl"
            class="card-wrapper shadow coral-card"
            :href="downladUrl(icon)"
            target="_blank"
            download
            @click="addClickCount(icon)"
          >
          
            <div class="card-img-wrapper">
              
              <div v-lazy-container="{ selector: 'img', loading: icons.loading }" >
                <img class="w-full" :alt="icon.appName +' icon'" :data-src="icon.lowResPngUrl">
              </div>

              <!-- <div class="quick-actions-wrapper">
                <div class="quick-action-el">
                  <coral-icon @click="showDialog('deleteDialog', icon)" class="h-full quick-action-icon" :icon="coralIcons.delete" title="Delete"></coral-icon>
                </div>
                <div class="quick-action-el">
                  <coral-icon @click="showDialog('deleteDialog', icon)" class="h-full quick-action-icon" :icon="coralIcons.delete" title="Delete"></coral-icon>
                </div>
              </div> -->
              
            </div>
            
            <div class="card-text-wrapper">
              
              <h3 class="coral-font-color">
                {{ prettifyName(icon.appName) }}
              </h3>
              
              <p class="coral-Body--XS opacity-60 m-b-20">
                <a v-if="icon.credit" rel="noopener" class="coral-Link" :href="icon.credit" target="_blank">
                  {{icon.usersName}}
                </a>
                <b v-else >
                  {{icon.usersName}}
                </b>
                on
                <span class="coral-Body--XS opacity-80">
                  {{ getDate(icon.timeStamp) }}
                </span>
              </p>

            </div>
          </a>
          

        </div>

    </section>
  </div>
</template>

<script>
import Header from './Header.vue';
import Hero from './Hero.vue';
import iconCard from './iconCard.vue';
import Dialog from './Dialog.vue';
import deleteDialog from './deleteDialog.vue';

import algoliasearch from 'algoliasearch'
import Parse from 'parse'

import VueLoadImage from 'vue-load-image'

import dotenv from 'dotenv'; // Used to access env varaibles
dotenv.config()

// TODO: remove credentiaks

const VUE_APP_PARSE_APP_ID = process.env.VUE_APP_PARSE_APP_ID
const VUE_APP_PARSE_JAVASCRIPT_KEY = process.env.VUE_APP_PARSE_JAVASCRIPT_KEY

Parse.initialize(VUE_APP_PARSE_APP_ID, VUE_APP_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = 'https://media.macosicons.com/parse'

var Icons = Parse.Object.extend("Icons");

let algolia = {
    appid: process.env.VUE_APP_ALGOLIA_APPID,
    apikey: process.env.VUE_APP_ALGOLIA_KEY
}

// TODO: remove credentiaks
let parseUser = process.env.VUE_APP_PARSE_USER
let parsePass = process.env.VUE_APP_PARSE_PASS


const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOS_parse')

const docLimit = 20

export default {
  name: 'Home',

  components: {
    Header,
    Hero,
    iconCard,
    Dialog,
    deleteDialog,
    'vue-load-image': VueLoadImage
  },

   metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'How to change app icons in macOS Big Sur',
      description:"Instructions on how to donlwoad and change app icons in macOS Big Sur using Finder and a website with over 5000+ free app icons.",
      // all titles will be injected into this template
      titleTemplate: '%s | macOSicons',
      meta:[
        // Facebook
        {
          property: 'og:url',
          vmid:     'og:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'og:title',
          vmid:     'og:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'og:description',
          vmid:     'og:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led. How to install custom icons on macOS Big Sur.',
        },

        // Twitter
        {
          property: 'twitter:url',
          vmid:     'twitter:url',
          content:  'https://macosicons.com'
        },
        {
          property: 'twitter:description',
          vmid:     'twitter:description',
          content:  'Free 5000+ App icons for macOS in the style of macOS Big Sur. Fully open source and community led. How to install custom icons on macOS Big Sur.',
        },
        {
          property: 'twitter:title',
          vmid:     'twitter:title',
          content:  'macOS app icon pack - 5000+ free and open source icons for Big Sur & iOS',
        },
        {
          property: 'twitter:image',
          vmid:     'twitter:image',
          content:  'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/Social/low-res/Thumbnail%20200.jpg'
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

      scrolledToBottom: true,
      sortByName: true,
      sortBy: "createdAt",
      isSearch: false,
      noIcons: true,
      isAuth: false,
      loadingError: false,
      
      howManyRecords: 0,

      isMacOs: true,

      scrolled: false,
      distanceFromTop: true ,

      message: "",
      today: "",

      iconListLen: 4_378,
      lastVisible: {},
      dataToShow: [],
      activeIcon: {},
      icons:{
        success: require("../assets/icons/delete.svg"),
        namingOrder: require("../assets/icons/namingOrder.svg"),
        date: require("../assets/icons/date.svg"),
        loading: require("../assets/no-app-icon.png"),
        iconsOrder: require("../assets/icons/namingOrder.svg")
      },
      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/no-app-icon.png"),
      }
    }
  },

  mounted: function(){
    let parent = this;
    
    window.addEventListener('scroll', this.handleScroll);
    
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

    if(Parse.User.current()){
      if (Parse.User.current().attributes.isAdmin) {
        parent.getIconsArray();
        parent.isAuth = true
      }else{
        parent.getIconsArray();
      }
    } else{
      Parse.User.logIn(parseUser, parsePass).then(()=>{
        console.log("Signed Insss");
        parent.getIconsArray();
      }).catch((e)=>{
        console.log("login: ", e);
      })
    }
    
  },

  methods:{ 

    logDonation(location){
      window.plausible("logDonation", {props: {
          location: location, 
      }})
    },

    async copySearch(){
      let parent = this;
      let toCopy = "https://macosicons.com/" + parent.searchString
      
      await navigator.clipboard.writeText(toCopy);

      parent.message = "✅ Link copied to your clipboard"
      parent.$store.dispatch('successMessage', {id: "successMessage"})

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

    changeOS(){
      let parent = this;

      function toggleClass(id, cssClass){
        document.getElementById(id).classList.toggle(cssClass)
      }

      toggleClass("osSwitcher", "switchRight")
      toggleClass("iOStext", "text-not-selected")
      toggleClass("macOStext", "text-not-selected")

      parent.isMacOs = !parent.isMacOs
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

      if (icon.id) {
        var id = icon.id
      } else {
        var id = icon.objectID
      }

      let today = parent.today;

      if (parent.isMacOs) {
        var platform = "macOS"
        window.plausible("downloadedIcons", {props: {
          platform: platform, 
          icon: icon.appName + ' - '+id,
          macOS:icon.appName + ' - '+id,
          date: today,
          users: icon.usersName
        }})
      } else {
        var platform = "iOS"
        window.plausible("downloadedIcons", {props: {
          platform: platform, 
          icon: icon.appName + ' - '+id, 
          iOS: icon.appName + ' - '+id,
          date: today,
          users: icon.usersName
        }})
      }


      // console.log("icon: ", icon);
      // console.log("ID: ", id);

      let query = new Parse.Query(Icons)
      let docToUpdate = await query.get(id)

      docToUpdate.increment("downloads")
      docToUpdate.save().then(() => {
        // console.log("Saved!!");
      }).catch((e) => {
        console.log("error: ", e);
      })
      
    },

    logout(){
      console.log("HI");
      parent.isAuth = false
      Parse.User.logOut().then(() => {
        const currentUser = Parse.User.current();  // this will now be null
      });
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
      let howManyRecords = parent.howManyRecords
      
      parent.howManyRecords = howManyRecords + docLimit

      const query = new Parse.Query(Icons);
      query.equalTo("approved", true)
      query.descending("createdAt");
      query.skip(howManyRecords);
      query.limit(docLimit);
      const results = await query.find()
      
      setTimeout(() => {
          parent.scrolledToBottom = true
      }, 800);

      for(let result in results){
        let objData = results[result].attributes
        let iconData = {}

        for(let data in objData){
          iconData[data] = objData[data]
        }
        iconData.id = results[result].id  
        
        parent.$store.dispatch("pushDataToArr", {arr: "list", data: iconData, func: "loadMore"})
      }

    },

    scroll() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

        if (bottomOfWindow && parent.scrolledToBottom && !parent.isSearch) {
          parent.scrolledToBottom = false
          parent.loadMore()
        }
      }
    },

    async getIconsArray(){
      let parent = this
      try {

        const query = new Parse.Query(Icons);
        query.equalTo("approved", true)
        query.descending("createdAt");
        query.limit(docLimit);
        parent.howManyRecords = docLimit
        const results = await query.find()

        query.count().then((count) =>{
          parent.iconListLen = count
        })

        for(let result in results){
          let objData = results[result].attributes
          let iconData = {}
          
          for(let data in objData){
            iconData[data] = objData[data]
          }
          iconData.id = results[result].id

          parent.$store.commit('pushDataToArr', {arr: "list", data: iconData, func: "getIconsArray"})
        }

        setTimeout(() => {
          let carbon = document.getElementById("carbonads")
          carbon.classList.add("coral-card")
        }, 1000);

        parent.scroll()

      } catch (error) {
        parent.loadingError = "true"
        console.log("loadingError: ", error);
      }

    },

    showDialog(dialogId, icon){
      let parent = this
      parent.activeIcon= icon
      document.getElementById(dialogId).show()
    },

    async editDoc(icon, e, field){
      let newName = e.target.value
      
      console.log(icon.objectID);
      console.log(icon);
      console.log(newName);
      
      const IconsBase = Parse.Object.extend("Icons");
      const query = new Parse.Query(IconsBase);
      const docToEdit = await query.get(icon.objectID)

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
      
      index.search(search, {filters: `approved:true`, hitsPerPage: 150 }).then(function(responses) {
        parent.$store.dispatch("pushDataToArr", {arr: "dataToShow", data: responses.hits, func: "searchAlgolia"})
      });
    }
  },

  computed:{

    getParseObj(){
      return Icons
    },

    toastMsg(){
      return this.$store.state.toastMsg
    },

    search(){
      let parent = this

      // If searchString is empty (no search by the user), return the full list of icons
      if(!parent.searchString){
        parent.isSearch = false
        parent.noIcons = false
        parent.$store.state.dataToShow = parent.$store.state.list
        return parent.$store.state.dataToShow
      }

      if(parent.$store.state.dataToShow.length == 0){
        parent.noIcons = true
      } else{
        parent.noIcons = false
      }

      return parent.$store.state.dataToShow
      // return  parent.dataToShow
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
  @import url(app.less);
  @import url(snack-helper.min.css);
  @import url(carbon.css);
</style>
