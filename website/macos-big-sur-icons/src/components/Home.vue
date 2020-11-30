<template>
  <div>
    
    <Dialog/>
    <!-- Header -->
    <Header/>
    
    <deleteDialog :icon="activeIcon"/>

    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submitIcon'"
      :iconListLen="iconListLen"
    />

    <coral-toast id="successToast" variant="success">
      😄 All icons have been uploaded.
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
      
    <!-- Wai ting spinning circle -->
      <div v-if="this.$store.state.list == 0" class="waiting-wrapper">
        <coral-wait size="L" indeterminate=""></coral-wait>
      </div>

      <div v-if="noIcons" class="waiting-wrapper">
        <p class="coral-Body--S">
          No resutls
        </p>
      </div>

    <!-- Icon list -->
        <div v-if="isAuth" class="icon-list-area p-t-20 p-b-50">
          
          <!-- Search Bar -->
          <div  v-for="icon in search" :key="icon.fileName+Math.floor(Math.random() * Math.floor(9999))" class="card-wrapper coral-card">
              <div class="card-img-wrapper" style="max-width: 120px;">
                
                <a :href="icon.icnsUrl">
                  <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :data-src="icon.pngUrl">
                  </div>
                </a>

                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="showDialog('deleteDialog', icon)" class="h-full quick-action-icon" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>
                  
              </div>

              <div class="p-l-15 p-r-15 p-b-15">

                  <p class="coral-Body--XS opacity-60 m-b-0">
                    <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                  </p>
                  <h3 class="coral-font-color m-b-0">
                    <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName')" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                  </h3>

                  <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                  <p class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input"></p>
                  <div v-if="icon.email != 'user@email.com' && icon.email " class="p-t-10"> 
                    <a class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission&body='+icon.usersName">
                          email
                    </a>
                  </div>
              </div>
          </div>
        </div>

      <!-- Seen when no auth  -->
        <div v-if="!isAuth" class="icon-list-area p-t-20 p-b-50">
          <a v-for="icon in search" :key="icon.fileName" class="card-wrapper shadow coral-card" :href="icon.icnsUrl">
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

      <!-- </div> -->

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
import algoliasearch from 'algoliasearch'

import Header from './Header.vue';
import Hero from './Hero.vue';
import iconCard from './iconCard.vue';
import Dialog from './Dialog.vue';
import deleteDialog from './deleteDialog.vue';

import * as firebase from "firebase";
import { Search } from '@adobe/coral-spectrum';

const storage = firebase.storage();
const db = firebase.firestore();

// let order = ["timeStamp", "desc"]
let order = ["appName", ""]
let dbCollection = db.collection("submissions").where("approved", "==", true).orderBy(order[0])
let lastVisible

let algolia = {
    appid: process.env.VUE_APP_ALGOLIA_APPID,
    apikey: process.env.VUE_APP_ALGOLIA_KEY
}

const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOSicons')

export default {
  name: 'Home',

  components: {
    Header,
    Hero,
    iconCard,
    Dialog,
    deleteDialog
  },

  data(){
    return{
      iconList:{},
      searchString: "",
      iconsToShow: [],
      list: [],

      scrolledToBottom: true,
      sortByName: true,
      isSearch: false,
      noIcons: true,
      isAuth: false,

      iconListLen: "2,676",
      lastVisible: {},
      dataToShow: [],
      activeIcon: {},
      searchResults: [],
      icons:{
        success: require("../assets/icons/delete.svg"),
        namingOrder: require("../assets/icons/namingOrder.svg"),
        date: require("../assets/icons/date.svg"),
        loading: require("../assets/loading.gif"),
        iconsOrder: require("../assets/icons/namingOrder.svg")
      },
      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/loading.gif"),
      }
    }
  },

  mounted: function(){
    let parent = this;

    // this.getIconListLen();
    this.getIconsArray();

     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("Signed In");
        parent.isAuth = true
      }
     })
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

    loadMore(){
      let parent = this
      console.log(lastVisible);
      dbCollection.startAfter(lastVisible).limit(20).get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          setTimeout(() => {
              parent.scrolledToBottom = true
          }, 300);
          let iconData = doc.data()
          iconData.id = doc.id
          parent.$store.dispatch("pushDataToArr", {arr: "list", data: iconData, func: "loadMore"})
          // parent.list.push(doc.data())
        })
        lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      })

    },

    scroll() {
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

      dbCollection.limit(15)
      .get().then(function (querySnapshot) {

        lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

        querySnapshot.forEach(function (doc) {
          let iconData = doc.data()
          
          let newFileName = doc.data().fileName.split(".png")
          newFileName.pop()
          newFileName = newFileName[0]+".icns"
          
          iconData.id = doc.id
          storage.ref('icons_approved/png/'+doc.data().fileName)
          storage.ref('icons_approved/'+newFileName)
          parent.$store.commit('pushDataToArr', {arr: "list", data: iconData, func: "getIconsArray"})
          // parent.list.push(iconData)
        })
      }).then(()=>{
        // parent.dataToShow =  parent.list
        // parent.$store.dispatch("pushDataToArr", {arr: "dataToShow", data: this.$store.state.list})
        parent.scroll()
      })
    },

    showDialog(dialogId, icon){
      let parent = this
      parent.activeIcon= icon
      document.getElementById(dialogId).show()
    },

    editDoc(icon, e, field){
      let newName = e.target.value
      let parent = this
      
      console.log(icon);
      console.log(newName);

      if (parent.isSearch) {
        db.collection("submissions").doc(icon.objectID).update({
          [field]: newName
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      } else{
        db.collection("submissions").doc(icon.id).update({
            [field]: newName
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      }
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
      index.search(search, {filters: 'approved:true', hitsPerPage: 100 }).then(function(responses) {
        // console.log(responses.hits);
        // parent.dataToShow = responses.hits
        parent.$store.dispatch("setDataToArr", {arr: "dataToShow", data: responses.hits, func: "searchAlgolia"})
        // parent.$store.dispatch("pushDataToArr", {arr: "dataToShow", data: responses.hits, func: "searchAlgolia"})
      });
    }
  },

  computed:{

    search(){
      let parent = this

      // If searchString is empty (no search by the user), return the full list of icons
      // if(!parent.searchString){
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

  props: {
  }
}
</script>

<style>
  @import url(app.css);
  @import url(snack-helper.min.css);
</style>
