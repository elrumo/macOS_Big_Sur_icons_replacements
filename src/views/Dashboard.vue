<template>
  <div>
    <coral-toast id="toastMessage" variant="success">
      All icons have been updated
    </coral-toast>

    <coral-toast id="error" variant="error">
      There has been an error, please try again.
    </coral-toast>

    <!-- Sign in well -->
    <div v-if="!isAuth" id="signIn-wrapper" class="coral-Well m-t-48">
      <div class="m-b-24">
        <input id="email" type="email" placeholder="Email" is="coral-textfield" aria-label="text input">
      </div>
      <div class="m-b-24">
        <input id="password" type="password" placeholder="Password" is="coral-textfield"  aria-label="text input">
      </div>
      <div id="signin-button" class="m-t-48 m-b-4">
        <button is="coral-button" variant="cta" @click="signIn">Sign In</button>
      </div>
    </div>
    

    <h3 id="noIcons" class="coral-Heading--M m-t-48" v-if="isObjEmpty(icons) & isAuth">
      No icons to aprove
    </h3>

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
      <!-- <div v-if="isAuth" @click="isSearch = true" class="main-search-wrapper coral-bg p-b-16">
        <div class="m-auto main-search">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'(Not working yet) - Icons to approve: ' + iconListLen" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark searchBar-left" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>
      </div> -->
      
      <!-- Tabs -->
      <coral-tablist v-if="isAuth">
        <coral-tab aria-label="newIcons" selected="" @click="changeIconStatus('newIcons')">
          New Icons
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ( {{iconListLen}} )
          </span>
        </coral-tab>
        
        <coral-tab aria-label="Approved Icons" @click="changeIconStatus('reUploaded')">
          Re-uploaded
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ( {{iconListLenReUpload}} )
          </span>
        </coral-tab>
      </coral-tablist>

      <div
        class="p-t-24 p-b-40 dashboard-wrapper"
      >
        <!-- v-if="iconsToShow == 'newIcons'" -->
        <div v-for="user in iconType" :key="user.usersName" class="p-b-32">
          
          <h3 class="coral-Heading--M p-b-8 text-left d-flex">
            <a
              :href="'mailto:'+user.email+'?subject=macOS icons submission'"
              @click="copyText(user.usersName)"
            >
              {{ user.usersName }}
            </a>
            <img @click="showDialog('editUserDialog', user)" class="dashboard-edit-user" :src="coralIcons.edit" alt="">
            <img @click="sendEmail(user)" class="dashboard-edit-user p-l-16" :src="coralIcons.email" alt="">
            
            <coral-status  v-if="user.emailSent == 'requested'" variant="info"></coral-status>
            <coral-status  v-if="user.emailSent == 'sent'" variant="success"></coral-status>

          </h3>

          <div class="icon-list-area">
            <div v-for="icon in user.icons" class="card-wrapper coral-card" :key="icon.fileName+icon.imgUrl">
              
              <coral-status v-if="icon.isReupload && icon.isAuthor" variant="success"></coral-status>
              <coral-status v-if="icon.isReupload && !icon.isAuthor" variant="warning"></coral-status>

              <div class="card-img-wrapper" style="max-width: 120px;">

                <div v-if="icon.isReview || icon.isReview && icon.isReUpload" class="loading-approval-wrapper">
                  <coral-status v-if="icon.isReview" variant="success"></coral-status>
                </div>

                <div v-if="!icon.isReview && icon.isReUpload" class="loading-approval-wrapper">
                  <coral-status v-if="icon.isReUpload" color="Yellow"></coral-status>
                </div>
                
                <a :href="icon.imgUrl" target="_blank">
                  <img
                    v-lazy="{
                        src: icon.imgUrl.replace('/media/', '/parse/'),
                        loading:  coralIcons.loading,
                        error:  coralIcons.loading,
                        lifecycle:  coralIcons.loading
                    }" 
                  />
                </a>


                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="deleteSubmission(icon)" class="quick-action-icon" :id="icon.fileName" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>

              </div>

              <div class="card-text-wrapper p-l-16 p-r-16 p-b-0">                
                
                <!-- Date Submited -->                
                <p class="coral-Body--XS opacity-60 m-b-0">
                  <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                </p>
                  
                <!-- App name -->
                <h3 class="coral-font-color m-b-0 m-t-0">
                  <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName', false)" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                </h3>

                <!-- User's name -->
                <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                
                <!-- Credit URL -->
                <p v-if="icon.credit !='' " class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input"></p>
                <p v-if="icon.credit =='' " class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="'n/a'" is="coral-textfield" aria-label="text input"></p>

                <div class="p-t-16 p-b-16">
                  <button @click="approveIcon(icon)" class="coral-btn coral-btn-primary">Approve</button>
                   
                   <!-- <coral-splitbutton>
                    <button class="coral-btn coral-btn-primary" is="coral-button" coral-splitbutton-action="">Action</button>
                    <button id="target1" type="button" is="coral-button" icon="ChevronDown" coral-splitbutton-trigger=""></button>
                  </coral-splitbutton>
                  <coral-popover target="#target1" placement="bottom">
                    <coral-buttonlist>
                      <button is="coral-buttonlist-item">Second Action</button>
                      <button is="coral-buttonlist-item">Third Action</button>
                    </coral-buttonlist>
                  </coral-popover> -->

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
import { mapGetters, mapActions } from 'vuex'

import Parse from 'parse/dist/parse.min.js';

const Icons = Parse.Object.extend("Icons2");
const User = Parse.Object.extend("User");

Parse.User.enableUnsafeCurrentUser() // Enable cache for user auth, to avoid having to always login

let lastVisible

const docLimit = 800

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import deleteIcon from "../assets/icons/delete.svg"
import emailIcon from "../assets/icons/email.svg"

export default {
  
  components:{
  },

  data: function(){
    return{
      icons:{
        reUploaded: {}
      },
      
      // Search
      isSearch: false,
      searchString: "",
      iconListLen: 0,
      iconListLenReUpload: 0,

      howManyRecords: 0,
      sortBy: "usersName",

      emailMsg: "Thanks you for your submission to macosicons.com! I'm just getting in touch with you to ask if you could ..., otherwise the icons won't work propperly. You can either email me back or re-submit the icons on macosicons.com. Thanks again, Elias webbites.io",
      // approvedIcons: {},
      isAuth: false,
      selectedUser: {},
      scrolledToBottom: true,

      iconsToShow: "newIcons",
      reUploadedIcons: {},

      coralIcons:{
        delete: deleteIcon,
        addIcon: addCoralIcon,
        newItem: newItemCoralIcon,
        edit: editCoralIcon,
        loading: placeholderCoralIcon,
        email: emailIcon,
      },
    }
  },

  methods:{
    ...mapActions(['showToast', 'setAuth', 'setUser']),
    
    changeIconStatus(status) {
      let parent = this
      parent.iconsToShow = status
      if (status == 'reUploaded') {
        console.log('reUploaded');
        parent.getReUploadIcons()
      }
    },

    async copyText(toCopy){
      await navigator.clipboard.writeText("https://macosicons.com/"+toCopy);
      await navigator.clipboard.writeText(toCopy);
    },
    
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

      console.log("icon: ", icon);
      // console.log(newName);

      if(isMultipleIcons){
        let listLen = Object.keys(icon.icons).length
        let count = 0

        for(let doc in icon.icons){

          const IconsBase = Parse.Object.extend("Icons2");
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

        const IconsBase = Parse.Object.extend("Icons2");
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

      console.log(user);
      Parse.User.logIn(email, password).then((user) => { // Logging in user
        this.isAuth = true;
        this.setUser(user)
        this.getParseData()
        this.getReUploadIcons()
      }).catch((error) =>{
        console.log(error);
      })
    },

    isObjEmpty(obj){
      return Object.keys(obj).length == 0
    },

    async deleteSubmission(icon){
        console.log(icon);

        let query = new Parse.Query(Icons)
        let docToDelete = await query.get(icon.id);

        docToDelete.destroy().then(() =>{
          Vue.delete(this.icons[icon.usersName].icons, icon.appName) // Delete object locally
          
          if (Object.keys(this.icons[icon.usersName].icons).length == 0 ) { // Delete user from UI if no icons are left
            Vue.delete(this.icons, icon.usersName)
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
      // console.log(icon);
      console.log("icon.id: ", icon.id);

      let newIcon = {...icon}
      delete newIcon.DownloadCount
      delete newIcon.user
      delete newIcon.category
      delete newIcon.type

      // Parse.Cloud.run("approve", icon).then((result)=>{
      Parse.Cloud.run("testJob", newIcon).then((result)=>{
        icon.isReview = true
        icon.isReUploadReview = true
        this.showToast({
          id: "toastMessage",
          message: "Icon has been approved",
          variant: "success"
        })
      }).catch((e)=>{
        console.log("e: ", e);
        this.showToast({
          id: "toastMessage",
          message: e,
          variant: "error"
        })
      });

    },

    async sendEmail(icon){  
      let parent = this
      console.log("icon: ", icon);
      
      parent.icons[icon.usersName].emailSent = "requested";

      let payLoad = {
        email: icon.email,
        usersName: icon.usersName,
        id: icon.user.objectId
      }

      Parse.Cloud.run("sendEmail", payLoad).then((result)=>{
        parent.icons[icon.usersName].emailSent = "sent";
        console.log(parent.icons[icon.usersName].emailSent);
        parent.showToast({
          id: "toastMessage",
          message: "Email has been sent",
          variant: "success"
        })
      }).catch((e)=>{
        console.log(e);
        parent.showToast({
          id: "toastMessage",
          message: e,
          variant: "error"
        })
      });

    },    

    getIconListLen(query){
      let parent = this
      query.count().then((count) =>{
        console.log(count);
        parent.iconListLen = count
      })
    },

    getIconListLenReUpload(query){
      let parent = this
      query.count().then((count) =>{
        console.log(count);
        parent.iconListLenReUpload = count
      })
    },

    async loadMore(){

      let parent = this
      let howManyRecords = parent.howManyRecords
      
      parent.howManyRecords = howManyRecords + docLimit

      const query = new Parse.Query(Icons);
      query.equalTo("approved", false)
      query.ascending(parent.sortBy);
      query.exists("highResPngFile");
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
            let user = docData.user

            docData.id = results[result].id

            if (usersName == "" || usersName == undefined ) {
              console.log("usersName undefined ");
              console.log("docData: ", docData);
            }else{
              if(parent.icons[usersName] == undefined ){
                Vue.set(parent.icons, usersName, {
                  "usersName": usersName, 
                  "email": email, 
                  "icons":{}, 
                  "creditUrl": creditUrl,
                  "user": user
                })
                Vue.set(parent.icons[usersName].icons, docData.id, docData)
                Vue.set(parent.icons[usersName].icons[docData.id], "imgUrl",  docData.highResPngUrl)        
              } else{
                Vue.set(parent.icons[usersName].icons, docData.id, docData)
                Vue.set(parent.icons[usersName].icons[docData.id], "imgUrl",  docData.highResPngUrl)
              }              
            }
      }

    },

    scroll() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 1600

        if (bottomOfWindow && parent.scrolledToBottom && !parent.isSearch) {
          parent.scrolledToBottom = false // replace it with your code
          parent.loadMore()
        }
      }
    },

    async getParseData(){
      let parent = this
      const query = new Parse.Query(Icons);
      
      // const userQuery = new Parse.Query(User);
      // userQuery.descending("modifiedAt");
      
      // query.equalTo("isReUpload", false)
      // query.ascending("usersName");

      // query.doesNotExist("icnsUrl");
      // query.doesNotExist("icnsFile");
      // query.equalTo("approved", true);
      query.equalTo("approved", false);
      query.descending("createdAt");
      query.exists("highResPngFile");
      query.limit(docLimit);
        
      
      try{
        var results = await query.find()
      } catch (error) {
          console.log(error);
          handleParseError(error)
      }

      parent.getIconListLen(query); // Get how many icons to approve.

      parent.howManyRecords = docLimit
      
      for(let result in results){
        let docObj = results[result].attributes;
        let docData = JSON.parse(JSON.stringify(docObj));
        docData.id = results[result].id

        docData.imgUrl = docData.highResPngUrl
        
        let usersName = docData.usersName
        let user
        
        if (docData.user) {
          user = docData.user
        }

        let appName = docData.appName
        let email = docData.email
        let creditUrl = docData.credit

        if (usersName == "" || usersName == undefined ) {      
          
          // Set user if the user is undefined has no icons on the dashboard
          if(parent.icons["Undefined"] == undefined ){
            Vue.set(parent.icons, "Undefined", {
              "usersName": "Undefined", 
              "email": email, 
              "icons":{},
              "emailSent": false,
              "creditUrl": creditUrl
            })
            Vue.set(parent.icons["Undefined"].icons, appName, docData)
            Vue.set(parent.icons["Undefined"].icons[docData.id], "usersName",  "Undefined")
            Vue.set(parent.icons["Undefined"], "usersName",  "Undefined")                
          } else{
            Vue.set(parent.icons["Undefined"].icons, docData.id, docData)
            Vue.set(parent.icons["Undefined"].icons[docData.id], "usersName",  "Undefined")
            Vue.set(parent.icons["Undefined"], "usersName",  "Undefined")
          }

        }else{

          // Set user if the user has no icons on the dashboard
          if(parent.icons[usersName] == undefined ){
            Vue.set(parent.icons, usersName, {
              "usersName": usersName, 
              "email": email, 
              "icons":{}, 
              "emailSent": false,
              "creditUrl": creditUrl,
              "user": user
            })

            Vue.set(parent.icons[usersName].icons, docData.id, docData)
            
          } else{
            Vue.set(parent.icons[usersName].icons, docData.id, docData)
          }

        }
      }
      
      this.scroll()
    },

    async getReUploadIcons(){
      const query = new Parse.Query(Icons);
      
      query.equalTo("approved", false)
      query.equalTo("isReUpload", true)
      query.descending("updatedAt");
      // query.ascending("usersName");
      query.exists("highResPngFile");
      query.limit(docLimit);
      
      try{
        var results = await query.find()
      } catch (error) {
          console.log(error);
          handleParseError(error)
      }

      this.getIconListLenReUpload(query); // Get how many icons to approve.

      this.howManyRecords = docLimit
      
      for(let result in results){
        
        let docObj = results[result].attributes;
        let docData = JSON.parse(JSON.stringify(docObj));
        docData.id = results[result].id

        docData.imgUrl = docData.highResPngUrl
        
        let usersName = docData.usersName
        let user
        
        if (docData.user) {
          user = docData.user
        }

        let appName = docData.appName
        let email = docData.email
        let creditUrl = docData.credit

        // Set user if the user has no icons on the dashboard
        if(this.icons.reUploaded[usersName] == undefined ){
          Vue.set(this.icons.reUploaded, usersName, {
            "usersName": usersName, 
            "email": email, 
            "icons":{}, 
            "emailSent": false,
            "creditUrl": creditUrl,
            "user": user
          })

          Vue.set(this.icons.reUploaded[usersName].icons, docData.id, docData)
          
        } else{
          Vue.set(this.icons.reUploaded[usersName].icons, docData.id, docData)
        }

      }

    }

  },

  mounted: function(){  
    function handleParseError(err){
      switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
          Parse.User.logOut();
          window.location.reload()
          break;
      
        default:
          break;
      }
    }

    if (this.currentUser) {

      if (!Parse.User.current().attributes.isAdmin) {
        this.$router.push({ path: '/#' })
        Parse.User.logOut();
        return
      }

      this.isAuth = true
      this.getParseData()
      this.getReUploadIcons()

    } else{
      this.isAuth = false
      console.log("You are not logged in");
    }
    
  },

  computed:{
    ...mapGetters([
      'getUser',
      'allIcons',
      'notApproved',
      'approvedIcons',
      'getAppCategories',
      'approvedIconsCount',
      'isLoading',
      'getSelectedIcon',
      'getUserInfo',
    ]),

    userIcons(){
      let parent = this
      
      if (!parent.userInfo) {
        console.log("parent.userInfo");
        return 0
      } else{
        if (parent.allIcons.length == 0) {
          parent.errorMessage = "No icons to show"
        }

        switch (parent.iconsToShow) {
          case "newIcons":
            parent.errorMessage = parent.user.username + " hasn't submitted any icons yet."
            console.log(parent.iconsToShow);
            return parent.allIcons

          case "reUploaded":
            console.log(parent.iconsToShow);
            return parent.approvedIcons
      
          default:
            break;
        }
      }
    },

    iconType(){
      let parent = this
      let iconsToShow = parent.iconsToShow

      if (iconsToShow == "newIcons") {
        return parent.icons
      } else {
        return parent.icons.reUploaded
      }

    },

    currentUser(){
      let currentUser = Parse.User.current(); // Check if user is currently logged in or not
      return currentUser
    }
  }

}

</script>

<style>
/* @import '/components/app.css'; */
/* @import '/components/snack-helper.min.css'; */
</style>