<template>
  <div>
    
    <Dialog/>
    <!-- Header -->
    <Header/>
    
    <!-- Hero -->
    <Hero
      v-bind:iconList="iconList"
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
            <input v-model="searchString" :placeholder="'Search ' + Object.keys(iconList).length + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>

        <!-- "Filter by" button -->
        <div class="filter-by-grid">
          <div class="filter-by-wrapper coral-card shadow">
              <coral-icon v-if="filterIsDate" class="h-full" icon="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/website/macos-big-sur-icons/src/assets/clock.svg" title="Add"></coral-icon>
              <coral-icon v-if="filterIsName" class="h-full" icon="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/website/macos-big-sur-icons/src/assets/namingOrder.svg" title="Add"></coral-icon>
          </div>
        </div>
      </div>
  
      <div class="icon-list-area p-t-50 p-b-50">
          <a v-for="icon in filteredList" :key="icon.name" class="card-wrapper shadow coral-card" :href="'https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+icon.name+'.icns'">
            <div class="card-img-wrapper">
              <img loading="lazy" v-lazy="'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/'+icon.name+'.png'" class="w-full" alt="">
            </div>
            <div>
              <h3 class="coral-font-color">
                {{ prettifyName(icon.name) }}
              </h3>
              <p class="coral-Body--XS p-b-10 opacity-60">By <a class="coral-Link" :href="icon.credit" target="_blank">{{icon.credit}}</a></p>
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
import Header from './Header.vue';
import Hero from './Hero.vue';
import Dialog from './Dialog.vue';

import * as firebase from "firebase";

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
      searchString: "",
      iconsToShow: [],
      filterIsDate: false,
      filterIsName: true,
      list: {},
      icons:{
        success: require("../assets/icons/delete.svg"),
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

    getIconsArray(){
      let parent = this

      let parentObj = []
      

       db.collection("icons").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          parent.list[doc.data().name] = doc.data()
        })
      })

       fetch('https://gist.githubusercontent.com/elrumo/7c9a5b8148de3dc7ef723e3c4286a08b/raw/45462ed8af4e21e412001c566d2e6468f4a05f62/credtits1.json')
        .then(response => response.text())
        .then((data) => {
          
          let creditList = JSON.parse(data).users;
          // console.log(creditList);

          for(let user in creditList){
            console.log(creditList[user]);
            for(let icon in creditList[user].icons){
              // arrList.push(creditList[user].icons[icon])
              // console.log(arrList);
              let iconName = creditList[user].icons[icon]
              // console.log(iconName);
              let matches = db.collection("icons").where("name", "==", iconName)
              // console.log(iconName);
              // console.log(matches);
              db.collection("icons").where("name", "==", iconName).get().then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    db.collection("icons").doc(doc.id).set({
                        creditUrl: creditList[user].credit,
                        credit: creditList[user].name,
                        name: doc.data().name,
                        timeStamp: doc.data().timeStamp
                    }).then(function() {
                        // console.log("Document successfully written!");
                        console.log(doc.id, " + ", doc.data().name);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });

                  });
              }).then((data) => {
              })
              // console.log(iconName);
              // console.log(creditList[user].name);
              // console.log(creditList[user].credit);
            }
          }
        })


      
      var list = []
      // fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icns.txt')
      fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/website_2/website/macos-big-sur-icons/icons.json')
        .then(response => response.text())
        .then((data) => {
          parent.iconList = JSON.parse(data).icons;
          let iconList = parent.iconList

          let iconsObj = {icons:{}}

          // for(let icon in iconList){
          //   // console.log(iconList[icon].credit);
          //   db.collection("icons").doc().set({
          //       credit: iconList[icon].credit,
          //       name: iconList[icon].name,
          //       timeStamp: iconList[icon].timeStamp,
          //   })
          //   .then(function() {
          //     console.log("Doc Done!");
          //   })
          // }


          if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            parent.darkMode = true
          }
      })

    }
  },

  computed:{
    filteredList: function () {

      var iconList = this.iconList;
      var searchString = this.searchString;

      if(!searchString){
        return iconList;
      }

      searchString = searchString.trim().toLowerCase();

      iconList = iconList.filter(function(item){
        if(item.name.toLowerCase().indexOf(searchString) !== -1){
          // console.log(item);
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
