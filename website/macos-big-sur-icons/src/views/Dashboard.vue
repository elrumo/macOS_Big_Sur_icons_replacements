<template>
  <div>
    <Header/>
    
    <!-- Sign in well -->
    <div id="signIn-wrapper" class="coral-Well m-t-50">
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

    <section class="dashBoard">
      <div class="p-t-50 p-b-50 dashboard-wrapper">
        <div v-for="user in icons" :key="user.usersName" class="p-b-30">
          
          <h3 class="coral-Heading--M p-b-10 text-left">
            <a :href="'mailto:'+user.email+'?subject=macOS icons submission'">
              {{ user.usersName }}
            </a>
          </h3>

          <div class="icon-list-area">
            <div v-for="icon in user.icons" class="card-wrapper coral-card" :key="icon.fileName">

              <div class="card-img-wrapper" style="max-width: 120px;">
                
                <div v-if="icon.isReview" class="loading-approval-wrapper">
                  <div class="loading-approval">
                    <coral-wait indeterminate=""></coral-wait>
                  </div>
                </div>

                <img loading="lazy" v-lazy="icon.imgUrl" class="w-full" alt="">
                <coral-quickactions placement="center" target="_prev">
                  <coral-quickactions-item type="button" @click="deleteSubmission(icon)" :id="icon.fileName" :icon="coralIcons.delete">Remove file</coral-quickactions-item>
                </coral-quickactions>
              </div>

              <div class="p-l-15 p-r-15 p-b-5">
                <h3 class="coral-font-color">
                  <input class="editable-input" style="border: none" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                  <!-- {{ prettifyName(icon.appName) }} -->
                </h3>
                <p class="coral-Body--XS p-b-10 opacity-60">By <a class="coral-Link" :href="user.creditUrl" target="_blank">{{icon.usersName}}</a></p>
                
                <div class="p-t-10">
                  <button @click="approveIcon(icon)" is="coral-button">Approve</button>

                  <div class="filler-space"></div>

                  <a class="coral-Link" :href="'mailto:'+user.email+'?subject=macOS icons submission&body=Hi '+user.usersName+emailMsg">
                    <button is="coral-button" variant="quiet">
                        Contact
                    </button>
                  </a>
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
import Header from '@/components/Header.vue';
import * as firebase from "firebase";
// import * as firebaseui from "firebaseui";

let db = firebase.firestore();
let functions = firebase.functions();
let storage = firebase.storage();

let parent = this

export default {
  
  data: function(){
    return{
      icons:{},
      emailMsg: "Thanks you for your submission to macosicons.com! I'm just getting in touch with you to ask if you could ..., otherwise the icons won't work propperly. You can either email me back or re-submit the icons on macosicons.com. Thanks again, Elias webbites.io",
      approvedIcons: {},
      isAuth: false,
      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
      },
    }
  },

  components:{
    Header
  },

  methods:{

    signIn(){
      let email = document.getElementById("email").value
      let password = document.getElementById("password").value
      console.log(email);

      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(user){
        console.log(user);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    },

    isObjEmpty(obj){
      return Object.keys(obj).length == 0
    },

    deleteSubmission(icon){
        let parent = this
        console.log(icon);
  
        let fileRef = storage.ref().child(icon.iconRef)
        
        fileRef.delete().then(function() {
          console.log(icon.appName, " deleted successfully.");
        }).catch(function(error) {
          console.log("Uh-oh, an error occurred with: ", icon.appName, " with ID: ", icon.id);
        });

        // Delete object from Firestore
        db.collection("submissions").doc(icon.id).delete().then(function() {
          console.log("Document successfully deleted!");
          

          Vue.delete(parent.icons[icon.usersName].icons, icon.appName) // Delete object locally
          
          if (Object.keys(parent.icons[icon.usersName].icons).length == 0 ) { // Delete user from UI if no icons are left
            Vue.delete(parent.icons, icon.usersName)
          }
          
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });

    },

    prettifyName(name){
      for(let i in name){
        name = name.replace("_", " ")
      }
      return name
    },

    approveIcon(icon){  
      console.log(icon);
      
      // functions.useFunctionsEmulator("http://localhost:5001")
      const convertToIcns = functions.httpsCallable("convertToIcns");

      convertToIcns(icon).then(result =>{
        console.log(result.data);
      })
    }

  },

  mounted: function(){  

    let parent = this

    function showEl(id){
      document.getElementById(id).style.display = "block"
    }
    function hideEl(id){
      document.getElementById(id).style.display = "none"
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("Signed In");
        var providerData = user.providerData;

        hideEl("signIn-wrapper")
        
        parent.isAuth = true
        console.log(parent.isAuth);

        db.collection("submissions").where("approved", "==", false)
          .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

              let docData = doc.data();
              docData.imgUrl = ""

              let usersName = docData.usersName
              let appName = docData.appName
              let email = docData.email
              let creditUrl = docData.credit
              let id = doc.id
              
              docData.id = id

              if (usersName == "" || usersName == undefined ) {
                console.log("usersName undefined ");
              }else{
                if(parent.icons[usersName] == undefined ){
                  Vue.set(parent.icons, usersName, {"usersName": usersName, "email": email, "icons":{}, "creditUrl": creditUrl})
                  Vue.set(parent.icons[usersName].icons, appName, docData)
                  var imgReference = storage.ref(docData.iconRef)
                  
                  imgReference.getDownloadURL().then(function(url) {
                    Vue.set(parent.icons[usersName].icons[appName], "imgUrl",  url)
                  })                
                } else{
                  Vue.set(parent.icons[usersName].icons, appName, docData)
                  var imgReference = storage.ref(docData.iconRef)

                  imgReference.getDownloadURL().then(function(url) {
                    Vue.set(parent.icons[usersName].icons[appName], "imgUrl",  url)
                  })
                }              
              }

          });
        }).then(function(querySnapshot) {
          
          // Get all approved icons
          // db.collection("submissions").where("approved", "==", true)
          //   .get().then(function(querySnapshot) {
          //     querySnapshot.forEach(function(doc) {
          //       parent.approvedIcons[doc.data().appName] = doc.data()
          //     })

        })
      }else {
        showEl("signIn-wrapper")
        console.log("Not Signed In");
          // User is signed out.
          // ...
        }
    });

  },

  computed:{
  }

}

</script>

<style>
/* @import '/components/app.css'; */
@import '/components/snack-helper.min.css';
</style>