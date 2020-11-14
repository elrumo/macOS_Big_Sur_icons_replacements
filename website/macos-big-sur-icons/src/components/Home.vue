<template>
  <div>
    
    <Dialog/>
    <!-- Header -->
    <Header/>
    
    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submitIcon'"
    />

    <coral-toast id="successToast" variant="success">
      😄 All icons have been uploaded.
    </coral-toast>


    <!-- Icon Section -->
    <section class="content-wrapper">

    <!-- Search bar -->
      <div class="main-search-wrapper coral-bg p-b-15">
        <div class="m-auto main-search" style="max-width:300px;">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'Search ' + list.length + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
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
          <a v-for="icon in filteredList" :key="icon.fileName" class="card-wrapper shadow coral-card" :href="icon.icnsUrl">
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
        Full icon <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements#credits" target="_blank" class="coral-Link">credits</a>
      </footer>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import Header from './Header.vue';
import Hero from './Hero.vue';
import Dialog from './Dialog.vue';

import * as firebase from "firebase";
let storage = firebase.storage();


let db = firebase.firestore();

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
    // let parent = this
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

    getIconsArray(){
      let parent = this

      let parentObj = []
      let list = []
      // fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icns.txt')
      //   .then(response => response.text()).then((data) => {
      //     list = data.split(",\n")
      //     console.log(list);

          db.collection("submissions").where("approved", "==", true)
          .get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              
              let iconData = doc.data()
              const docRef = db.collection('submissions').doc(doc.id);
              
              // console.log(creditList.iconData); 

              let newFileName = doc.data().fileName.split(".png")
              newFileName.pop()
              newFileName = newFileName[0]+".icns"

              var imgRef = storage.ref('icons_approved/png/'+doc.data().fileName)
              var incsRef = storage.ref('icons_approved/'+newFileName)

              let listLen = parent.list.push(iconData)

            // Get file URLs and write them on Firestore
              // imgRef.getDownloadURL().then(function(url) {
              //   docRef.update({
              //         pngUrl: url
              //   });
              // }).catch((err) =>{console.log(err);})

              // incsRef.getDownloadURL().then(function(url) {
              //   docRef.update({
              //         icnsUrl: url

              //     });
              // }).catch((err) =>{console.log(err);})

            })
          }).then((data)=>{
            parent.gitHubList = list
              // for(let icon in list){
              //   if(parent.list[icon].appName != list[icon]){
              //     console.log(parent.list[icon].appName, ": ", list[icon]);
              //   }
              // }
          })
          



      // })

      let credits = {
        // Save credits to Firebase

        //  fetch('https://gist.githubusercontent.com/elrumo/281942475340b3d6ff0838aa120367d7/raw/6bc2a44a1a2b1e95fcba56a262a4f09006c87479/icns.json')
        //   .then(response => response.text()).then((data) => {
            
        //     console.log(data);
            // let creditList = JSON.parse(data);
            // console.log("creditList: ", creditList);

            // let iconList = []

            // for(let user in creditList){
            //   console.log(creditList[user]);
            //   for(let icon in creditList[user].icons){
            //     // arrList.push(creditList[user].icons[icon])
            //     // console.log(arrList);
            //     let iconName = creditList[user].icons[icon]
            //     // console.log(iconName);
            //     let matches = db.collection("icons").where("name", "==", iconName)
            //     // console.log(iconName);
            //     // console.log(matches);
            //     db.collection("approvedIcons").where("name", "==", iconName).get().then(function (querySnapshot) {
            //         querySnapshot.forEach(function (doc) {

            //           // console.log(doc.data());
            //           // iconList.push(doc.data())

            //           db.collection("approvedIcons").doc(doc.id).set({
            //               creditUrl: creditList[user].credit,
            //               credit: creditList[user].name,
            //               name: doc.data().name,
            //               timeStamp: doc.data().timeStamp
            //           }).then(function() {
            //               // console.log("Document successfully written!");
            //               console.log(doc.id, " + ", doc.data().name);
            //           }).catch(function(error) {
            //               console.error("Error writing document: ", error);
            //           });

            //         });
            //     }).then((data) => {
            //       // console.log(iconList);
            //       // console.log(iconList.length);
            //     })
            //     // console.log(iconName);
            //     // console.log(creditList[user].name);
            //     // console.log(creditList[user].credit);
            //   }
            // }
          // })


        
        // // Save icons to Firebase
        // fetch('https://gist.githubusercontent.com/elrumo/281942475340b3d6ff0838aa120367d7/raw/6bc2a44a1a2b1e95fcba56a262a4f09006c87479/icns.json')
        //   .then(response => response.text())
        //   .then((data) => {
        //     parent.iconList = JSON.parse(data).icons;
        //     let iconList = parent.iconList

        //     let iconsObj = {icons:{}}
            
        //     let listLen = Object.keys(iconList).length
        //     let count = 0

        //     for(let icon in iconList){
        //       db.collection("submissions").doc().set(iconList[icon])
        //       .then(function() {
        //         count++
        //         console.log(count);
        //         if (count == listLen) {
        //           console.log("AllDone!");
        //         } else{
        //           console.log("Doc Done!");
        //         }
        //       })
        //     }


        //     if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        //       parent.darkMode = true
        //     }
        // })
      }

    }
  },

  computed:{

    filteredList: function () {
      let parent = this

      var iconList = this.list;
      var gitHubList = this.gitHubList;
      var searchString = this.searchString;

      // If searchString is empty (no search by the user), return the full list of icons
      if(!searchString){
        iconList.sort(function(a, b) {
            var textA = a.appName.toUpperCase();
            var textB = b.appName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        // gitHubList.sort(function(a, b) {
        //     var textA = a.toUpperCase();
        //     var textB = b.toUpperCase();
        //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        // });

        // for(let icon in gitHubList){
        //   if(parent.list[icon].appName != gitHubList[icon]){
        //     console.log(parent.list[icon].appName, ": ", gitHubList[icon]);
        //   }
        // }

        return iconList;
      }

      searchString = searchString.trim().toLowerCase();
      iconList = iconList.filter(function(item){
        if(parent.prettifyName(item.appName).toLowerCase().indexOf(searchString) !== -1){
          return item;
        }
      })

      return iconList;
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
