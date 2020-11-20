<template>
  <div>
    
    <Dialog/>
    <!-- Header -->
    <Header/>
    
    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submitIcon'"
      :iconListLen="iconListLen"
    />

    <coral-toast id="successToast" variant="success">
      😄 All icons have been uploaded.
    </coral-toast>

    <div style="display: none"> {{search}} </div>
    <!-- Icon Section -->
    <section class="content-wrapper">

    <!-- Search bar -->
      <div @click="isSearch = true" class="main-search-wrapper coral-bg p-b-15">
        <div class="m-auto main-search" style="max-width:300px;">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'Search ' + iconListLen + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>

      <!-- "Filter by" button -->
        <div class="filter-by-grid" @click="changeSortOrder">
          <div class="filter-by-wrapper coral-card shadow">
              <coral-icon class="h-full" :icon="icons.iconsOrder" title="Add"></coral-icon>
          </div>
        </div>
      </div>
      
    <!-- Waiting spinning circle -->
      <div v-if="list.length == 0" class="waiting-wrapper">
        <coral-wait size="L" indeterminate=""></coral-wait>
      </div>

    <!-- Icon list -->
      <div class="icon-list-area p-t-20 p-b-50">
          <!-- <a v-for="icon in filteredList" :key="icon.fileName" class="card-wrapper shadow coral-card" :href="icon.icnsUrl"> -->
          <a v-for="icon in dataToShow" :key="icon.fileName" class="card-wrapper shadow coral-card" :href="icon.icnsUrl">
            <div class="card-img-wrapper">
              <div v-lazy-container="{ selector: 'img', loading: icons.loading }">
                <img class="w-full" :data-src="icon.pngUrl">
              </div>
            </div>
            <div>
              <h3 class="coral-font-color">
                {{ prettifyName(icon.appName) }}
              </h3>
              <p class="coral-Body--XS opacity-60 m-b-20"><a class="coral-Link" :href="icon.credit" target="_blank">{{icon.usersName}}</a> on <span class="coral-Body--XS opacity-50">{{ getDate(icon.timeStamp) }}</span></p>
            </div>
          </a>
      </div>

    </section>

    <!-- Footer -->
    <section>
      <footer class="p-b-20 coral-Body--S">
        Made with ❤️ by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
        <dir class="d-inline-block m-0 p-l-15 p-r-10">
          <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
        </dir>
        <a href="https://www.paypal.com/donate?hosted_button_id=VS64ARMNSB67J" target="_blank" class="coral-Link">Support the project</a>
      </footer>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import Header from './Header.vue';
import Hero from './Hero.vue';
import Dialog from './Dialog.vue';
import algoliasearch from 'algoliasearch'

import * as firebase from "firebase";
let storage = firebase.storage();


let db = firebase.firestore();
// let order = ["timeStamp", "desc"]
let order = ["appName", ""]
let dbCollection = db.collection("submissions").where("approved", "==", true).orderBy(order[0])
let lastVisible

let algolia = {
    appid: process.env.VUE_APP_ALGOLIA_APPID,
    apikey: process.env.VUE_APP_ALGOLIA_KEY
}
// const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOSicons')

export default {
  name: 'Home',

  components: {
    Header,
    Hero,
    Dialog
  },

  data(){
    return{
      iconList:{},
      gitHubList:[],
      searchString: "",
      iconsToShow: [],
      sortByName: true,
      list: [],
      scrolledToBottom: true,
      isSearch: false,
      iconListLen: 0,
      lastVisible: {},
      dataToShow: [],
      searchResults: [],
      icons:{
        success: require("../assets/icons/delete.svg"),
        namingOrder: require("../assets/icons/namingOrder.svg"),
        date: require("../assets/icons/date.svg"),
        loading: require("../assets/loading.gif"),
        iconsOrder: require("../assets/icons/namingOrder.svg")
      }
    }
  },

  mounted: function(){
    this.getIconListLen()
    this.getIconsArray()
  },

  methods:{
    
    prettifyName(name){
      // let newName = name
      for(let i in name){
        name = name.replace("_", " ")
      }
      // console.log(newName);
      return name
    },

    changeSortOrder(){
      let parent = this
      let sortByName = parent.sortByName
      let date = parent.icons.date
      let namingOrder = parent.icons.namingOrder

      if (sortByName) {
        parent.icons.iconsOrder = date
      } else{
        parent.icons.iconsOrder = namingOrder
      }

      parent.sortByName = !sortByName
    },
    
    getDate(timeStamp){
      let newDate = new Date(timeStamp)
      
      let day = newDate.getUTCDate()
      let month = newDate.getUTCMonth() + 1
      let year = newDate.getFullYear()
      let date = day + "/" + month + "/" + year

      return date
    },

    loadMore(){
      let parent = this
      console.log(lastVisible);
      dbCollection.startAfter(lastVisible).limit(20).get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          setTimeout(() => {
              parent.scrolledToBottom = true
          }, 300);
          parent.list.push(doc.data())
        })
        lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      })

    },

    scroll () {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 1200

        if (bottomOfWindow && parent.scrolledToBottom && !parent.isSearch) {
          parent.scrolledToBottom = false // replace it with your code
          parent.loadMore()
        }
      }
    },

    getIconListLen(){
      let parent = this
      dbCollection.onSnapshot(function(doc){
        parent.iconListLen = doc.docs.length
      })
    },

    getIconsArray(){
      let parent = this

      let parentObj = []
      let list = []

      dbCollection.limit(20)
      .get().then(function (querySnapshot) {

        lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

        querySnapshot.forEach(function (doc) {
          let iconData = doc.data()
          const docRef = db.collection('submissions').doc(doc.id);
          
          let newFileName = doc.data().fileName.split(".png")
          newFileName.pop()
          newFileName = newFileName[0]+".icns"

          var imgRef = storage.ref('icons_approved/png/'+doc.data().fileName)
          var incsRef = storage.ref('icons_approved/'+newFileName)
          let listLen = parent.list.push(iconData)
        })
      }).then((data)=>{
        parent.dataToShow =  parent.list
        parent.gitHubList = list
        parent.scroll()
      })
    }
  },

  computed:{

    filteredList() {
      let parent = this

      var iconList = this.list;
      var gitHubList = this.gitHubList;
      var searchString = this.searchString;

      // If searchString is empty (no search by the user), return the full list of icons
      if(!searchString){
        console.log(searchString);
        parent.isSearch = false
        // iconList.sort(function(a, b) {
        //     var textA = a.appName.toUpperCase();
        //     var textB = b.appName.toUpperCase();
        //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        // });

        return iconList;
      }

      searchString = searchString.trim().toLowerCase();
      iconList = iconList.filter(function(item){
        if(parent.prettifyName(item.appName).toLowerCase().indexOf(searchString) !== -1){
          return item;
        }
      })

      return iconList;
    },

    search(){
      let parent = this

      var iconList = this.list;
      var gitHubList = this.gitHubList;
      var searchString = this.searchString;

      // If searchString is empty (no search by the user), return the full list of icons
      if(!parent.searchString){
        parent.isSearch = false
        // Vue.set(parent.dataToShow, parent.list)
        parent.dataToShow = parent.list
        return parent.dataToShow
      }

      index.search(parent.searchString, { hitsPerPage: 1000 }).then(function(responses) {
        console.log(responses.hits);
        
        return parent.dataToShow = responses.hits
      });

      // console.log(searchResults);

      // return parent.searchResults
    }

  },

  props: {
  }
}
</script>

<style>
  @import url(app.css);
  @import url(snack-helper.min.css);
</style>
