<template>
  <div>
    <Header/>
    
    <coral-toast id="iconUpdated" variant="success">
      All icons have been updated
    </coral-toast>

    <coral-toast id="iconApproved" variant="success">
      Icon has been approved
    </coral-toast>

    <coral-toast id="approveError" variant="error">
      There has been an error, please Approve again
    </coral-toast>

    <coral-toast id="error" variant="error">
      There has been an error, please try again.
    </coral-toast>

    <!-- Sign in well -->
    <div v-if="!isAuth" id="signIn-wrapper" class="coral-Well m-t-50">
      <div class="m-b-20">
        <input id="email" type="email" placeholder="Email" is="coral-textfield" aria-label="text input">
      </div>
      <div class="m-b-20">
        <input id="password" type="password" placeholder="Password" is="coral-textfield"  aria-label="text input">
      </div>
      <div id="signin-button" class="m-t-40 m-b-5">
        <button is="coral-button" variant="cta" @click="signIn">Sign In</button>
      </div>
    </div>
    

    <h3 id="noIcons" class="coral-Heading--M m-t-50" v-if="isObjEmpty(icons) & isAuth">
      No icons to aprove
    </h3>

    
    <div class="m-t-40">
      <!-- <input type="file" id="profilePhotoFileUpload" @change="uploadFile"> -->
      <!-- <button is="coral-button" variant="cta" @click="migrateFiles">Migrate Files</button> -->
    </div>

  <!-- Edit user dialog -->
    <coral-dialog id="editUserDialog">
      <coral-dialog-header>{{ selectedUser.usersName }}</coral-dialog-header>
      
      <coral-dialog-content>  
        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="nameEditUser" class="coral-FieldLabel">usersName</label>
          <input id="nameEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'usersName', true)" :value="selectedUser.usersName" labelledby="nameEditUser" class="coral-Form-field">

          <label id="creditEditUser" class="coral-FieldLabel">Credit</label>
          <input id="creditEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'credit', true)" :value="selectedUser.creditUrl" labelledby="creditEditUser" class="coral-Form-field">

          <label id="emailEditUser" class="coral-FieldLabel">email</label>
          <input id="emailEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'email', true)" :value="selectedUser.email" labelledby="emailEditUser" class="coral-Form-field">
        </form>
      </coral-dialog-content>

      <coral-dialog-footer>
        <button is="coral-button" variant="primary" coral-close="">Done</button>
      </coral-dialog-footer>
    </coral-dialog>

    <section class="dashBoard">
      
      <!-- Search Bar -->
      <div v-if="isAuth" @click="isSearch = true" class="main-search-wrapper coral-bg p-b-15">
        <div class="m-auto main-search">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'(Not working yet) - Icons to approve: ' + iconListLen" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>
      </div>

      <div class="p-t-20 p-b-50 dashboard-wrapper">
        <div v-for="user in icons" :key="user.usersName" class="p-b-30">
          
          <h3 class="coral-Heading--M p-b-10 text-left">
            <a :href="'mailto:'+user.email+'?subject=macOS icons submission'">
              {{ user.usersName }}
            </a>
            <img @click="showDialog('editUserDialog', user)" class="dashboard-edit-user" :src="coralIcons.edit" alt="">
          </h3>

          <div class="icon-list-area">
            <div v-for="icon in user.icons" class="card-wrapper coral-card" :key="icon.fileName">

              <div class="card-img-wrapper" style="max-width: 120px;">
                <div v-if="icon.isReview" class="loading-approval-wrapper">
                  <div class="loading-approval">
                  </div>
                </div>
                <a :href="icon.imgUrl">
                  <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :data-src="icon.imgUrl">
                  </div>
                </a>


                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="deleteSubmission(icon)" class="h-full quick-action-icon" :id="icon.fileName" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>

              </div>

              <div class="p-l-15 p-r-15 p-b-0">                
                
                <!-- Date Submited -->                
                <p class="coral-Body--XS opacity-60 m-b-0">
                  <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                </p>
                  
                <!-- App name -->
                <h3 class="coral-font-color m-b-0">
                  <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName', false)" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                </h3>

                <!-- User's name -->
                <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                
                <!-- Credit URL -->
                <p v-if="icon.credit !='' " class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input"></p>
                <p v-if="icon.credit =='' " class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="'n/a'" is="coral-textfield" aria-label="text input"></p>

                <div class="p-t-15">
                  <button @click="approveIcon(icon)" class="coral-btn coral-btn-primary">Approve</button>

                  <!-- Contact -->
                  <div v-if="icon.email != 'user@email.com'" class="p-t-10"> 
                    <a class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission&body='+icon.usersName">
                          email
                    </a>
                  </div>
                </div>
                
              </div>

            </div>
          </div>
          

        </div>
        <!-- Approved Icons -->
        <div v-if="!isObjEmpty(approvedIcons)"  class="m-t-50 p-50 coral-Well" id="approved-icons">
          <h3 class="coral-Heading--L p-b-20 m-t-0 text-left">
            Approved
          </h3>

          <div class="icon-list-area">
            <div v-for="icon in approvedIcons" class="card-wrapper coral-card" :key="icon.fileName">

                <div class="card-img-wrapper" style="max-width: 120px;">
                  Image
                  <!-- <img loading="lazy" v-lazy="icon.imgUrl" class="w-full" alt=""> -->
                </div>

                <div class="p-l-15 p-r-15 p-b-5">
                  <h3 class="coral-font-color">
                    {{ prettifyName(icon.appName) }}
                  </h3>
                  <p class="coral-Body--XS p-b-10 opacity-60">By <a class="coral-Link" :href="icon.credit" target="_blank">{{icon.usersName}}</a></p>
                  
                  <div class="p-t-10">
                    <div class="filler-space"></div>

                    <a class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission&body=Hi '+icon.usersName+emailMsg">
                      <button is="coral-button" variant="quiet">
                          Contact
                      </button>
                    </a>
                  </div>
                  
                </div>

            </div>
          </div>

        </div>

      </div>
    </section>

  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex';
import Header from '@/components/Header.vue';
import * as firebase from "firebase";

import Parse from 'parse'

Parse.initialize("macOSicons");
Parse.serverURL = 'https://onionicons.com/parse'
const Icons = Parse.Object.extend("Icons");
const icons = new Icons();

Parse.User.enableUnsafeCurrentUser() // Enable cache for user auth, to avoid having to always login
const currentUser = Parse.User.current(); // Check if user is currently logged in or not


let db = firebase.firestore();
let functions = firebase.functions();
let storage = firebase.storage();

// let dbCollection = db.collection("submissions").where("approved", "==", false)
let dbCollection = db.collection("submissions").where("approved", "==", false).orderBy("usersName").orderBy("timeStamp")
let lastVisible

const docLimit = 20

export default {
  
  data: function(){
    return{
      icons:{},
      
      // Search
      isSearch: false,
      searchString: "",
      iconListLen: 0,

      howManyRecords: 0,
      sortBy: "usersName",

      emailMsg: "Thanks you for your submission to macosicons.com! I'm just getting in touch with you to ask if you could ..., otherwise the icons won't work propperly. You can either email me back or re-submit the icons on macosicons.com. Thanks again, Elias webbites.io",
      approvedIcons: {},
      isAuth: false,
      selectedUser: {},
      scrolledToBottom: true,

      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/loading.gif"),
      },
    }
  },

  components:{
    Header
  },

  methods:{
    ...mapActions(['showToast']),
    
    uploadFile(){
      const fileUploadControl = document.getElementById("profilePhotoFileUpload");

      if (fileUploadControl.files.length > 0) {
        const file = fileUploadControl.files[0];
        console.log(file);
        const name = file.name;
        console.log(name);

        const parseFile = new Parse.File(name, file);

        parseFile.save().then((uploaded) => {
          console.log("Success: ", uploaded);
          // The file has been saved to Parse.
        }, function(error) {
          console.log(error);
          // The file either could not be read, or could not be saved to Parse.
        });
      }
    },

    showDialog(dialogId, user){
      let parent = this
      
      let nameEditUserInput = document.getElementById("nameEditUserInput")
      let creditEditUserInput = document.getElementById("creditEditUserInput")
      let emailEditUserInput = document.getElementById("emailEditUserInput")

      nameEditUserInput.value = user.usersName
      creditEditUserInput.value = user.creditUrl
      emailEditUserInput.value = user.email

      document.getElementById(dialogId).show()
      parent.selectedUser = user

      console.log(user);
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

    async editDoc(icon, e, field, isMultipleIcons){
      let parent = this
      let newName = e.target.value

      console.log(newName);

      if(isMultipleIcons){
        let listLen = Object.keys(icon.icons).length
        let count = 0

        for(let doc in icon.icons){

          const IconsBase = Parse.Object.extend("Icons");
          const query = new Parse.Query(IconsBase);
          const docToEdit = await query.get(icon.icons[doc].id)

          docToEdit.set({ [field]: newName }) // Save icnsToStore obj with .icns file and its url to Parse server
          docToEdit.save().then(() =>{
            console.log(field, "updated.");
          }).catch((e) =>{
            document.getElementById("error").show()
          })

        }
      } else if(!isMultipleIcons){

        const IconsBase = Parse.Object.extend("Icons");
        const query = new Parse.Query(IconsBase);
        const docToEdit = await query.get(icon.id)

        docToEdit.set({ [field]: newName }) // Save icnsToStore obj with .icns file and its url to Parse server
        docToEdit.save().then(() =>{
          console.log(field, "updated.");
        }).catch((e) =>{
          document.getElementById("error").show()
        })
      }
    },

    async signIn(){
      let email = document.getElementById("email").value
      let password = document.getElementById("password").value
      console.log(email);

      const user = new Parse.User();
      user.set({
        username: email,
        password: password,
        email: email
      });

      try {
        await user.signUp().then(()=>{
          parent.isAuth =  true;
        });
        console.log();
      } catch (error) {
        console.log(error.code);

        if (error.code == 202) { // 202 error = email arleady exists, so attemptying to log them in instead.
          Parse.User.logIn(email, password).then((user) => { // Logging in user
            parent.isAuth = true;
            console.log(user);
          }).catch((error) =>{
            console.log(error);
          })
        }
        
      }
    },

    isObjEmpty(obj){
      return Object.keys(obj).length == 0
    },

    async deleteSubmission(icon){
        let parent = this
        console.log(icon);

        let query = new Parse.Query(Icons)
        let docToDelete = await query.get(icon.id);

        docToDelete.destroy().then(() =>{
          Vue.delete(parent.icons[icon.usersName].icons, icon.appName) // Delete object locally
          
          if (Object.keys(parent.icons[icon.usersName].icons).length == 0 ) { // Delete user from UI if no icons are left
            Vue.delete(parent.icons, icon.usersName)
          }
        }).catch((e) =>{
          console.log(e);
        })

    },

    prettifyName(name){
        // for(let i in name){
      name = name.replaceAll("_", " ")
      return name
      //   }
    },

    async approveIcon(icon){  
      let parent = this
      console.log(icon);

      let parentIcon = parent.icons[icon.usersName].icons[icon.appName]

      Parse.Cloud.run("approve", icon).then((result)=>{
        console.log(result);
        Vue.set(parentIcon, 'isReview', true)
        parent.showToast({id:"iconApproved"})
      }).catch((e)=>{
        console.log(e);
        parent.showToast({id:"approveError"})
      });
    },

    // async migrateFiles(){  
    //   let parent = this
      
    //   let params = {
    //     url: "http://82.145.63.160:1337/parse/files/macOSicons/c0ad2c7645e64ae7449339f0f8a38ccc_image.png"
    //   }

    //   Parse.Cloud.run("migrateFiles", params).then((result)=>{
    //     console.log(result);
    //     parent.showToast({id:"iconApproved"})
    //   }).catch((e)=>{
    //     console.log(e);
    //     parent.showToast({id:"approveError"})
    //   });
    // },

    indexIcon(icon){  
      console.log(icon);
      functions.useFunctionsEmulator("http://localhost:5001")
      const indexIcon = functions.httpsCallable("indexIconTest");
      
      indexIcon(icon).then(result =>{
        console.log(result.data);
      })
    },
    

    getIconListLen(){
      let parent = this
      dbCollection.onSnapshot(function(doc){
        parent.iconListLen = doc.docs.length
      })
    },

    async loadMore(){

      let parent = this
      let howManyRecords = parent.howManyRecords
      
      parent.howManyRecords = howManyRecords + docLimit

      const query = new Parse.Query(Icons);
      query.equalTo("approved", false)
      query.ascending(parent.sortBy);
      query.skip(howManyRecords);
      query.limit(docLimit);
      const results = await query.find()
      
      setTimeout(() => {
          parent.scrolledToBottom = true
      }, 800);

      for(let result in results){
        let objData = results[result].attributes
        let iconData = objData


            let docData = {}
            for(let key in objData){
              docData[key] = objData[key]
            }

            docData.imgUrl = ""

            let usersName = docData.usersName
            let appName = docData.appName
            let email = docData.email
            let creditUrl = docData.credit
            
            docData.id = results[result].id

            if (usersName == "" || usersName == undefined ) {
              console.log("usersName undefined ");
              console.log("docData: ", docData);
            }else{
              if(parent.icons[usersName] == undefined ){
                Vue.set(parent.icons, usersName, {"usersName": usersName, "email": email, "icons":{}, "creditUrl": creditUrl})
                Vue.set(parent.icons[usersName].icons, appName, docData)
                Vue.set(parent.icons[usersName].icons[appName], "imgUrl",  docData.highResPngUrl)        
              } else{
                Vue.set(parent.icons[usersName].icons, appName, docData)
                Vue.set(parent.icons[usersName].icons[appName], "imgUrl",  docData.highResPngUrl)
              }              
            }
      }

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

  },

  mounted: function(){  

    let parent = this
    
    parent.getIconListLen();

    function showEl(id){
      document.getElementById(id).style.display = "block"
    }
    function hideEl(id){
      document.getElementById(id).style.display = "none"
    }

    if (currentUser) {
      parent.isAuth = true
      
      async function getParseData(){
        const query = new Parse.Query(Icons);
        query.equalTo("approved", false)
        query.ascending("usersName");
        query.limit(docLimit);
        const results = await query.find()

        parent.howManyRecords = docLimit
        
        for(let result in results){
          let docObj = results[result].attributes;
          let docData = JSON.parse(JSON.stringify(docObj));
          docData.id = results[result].id

          docData.imgUrl = docData.highResPngUrl
          
          let usersName = docData.usersName
          let appName = docData.appName
          let email = docData.email
          let creditUrl = docData.credit

          let imgReference

          if (usersName == "" || usersName == undefined ) {      

            if(parent.icons["Undefined"] == undefined ){
              Vue.set(parent.icons, "Undefined", {"usersName": "Undefined", "email": email, "icons":{}, "creditUrl": creditUrl})
              Vue.set(parent.icons["Undefined"].icons, appName, docData)
              Vue.set(parent.icons["Undefined"].icons[appName], "usersName",  "Undefined")
              Vue.set(parent.icons["Undefined"], "usersName",  "Undefined")                
            } else{
              Vue.set(parent.icons["Undefined"].icons, appName, docData)
              Vue.set(parent.icons["Undefined"].icons[appName], "usersName",  "Undefined")
              Vue.set(parent.icons["Undefined"], "usersName",  "Undefined")
            }

          }else{

            if(parent.icons[usersName] == undefined ){
              Vue.set(parent.icons, usersName, {"usersName": usersName, "email": email, "icons":{}, "creditUrl": creditUrl})
              Vue.set(parent.icons[usersName].icons, appName, docData)
              
            } else{
              Vue.set(parent.icons[usersName].icons, appName, docData)
            }

          }
        }
        parent.scroll()
      }

      getParseData()

    } else{
      parent.isAuth = false
      console.log("You are not logged in");
    }
    
  },

  computed:{
  }

}

</script>

<style>
/* @import '/components/app.css'; */
@import '/components/snack-helper.min.css';
</style>