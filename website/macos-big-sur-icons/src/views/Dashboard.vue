<template>
  <div>
    <Header/>
    
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
                <img loading="lazy" v-lazy="icon.imgUrl" class="w-full" alt="">
              </div>

              <div class="p-l-15 p-r-15 p-b-5">
                <h3 class="coral-font-color">
                  {{ prettifyName(icon.appName) }}
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
        <div class="m-t-50 p-50 coral-Well">
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
                    <button @click="" is="coral-button">Remove</button>

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

let db = firebase.firestore();
let functions = firebase.functions();
let storage = firebase.storage();

export default {
  
  data: function(){
    return{
      icons:{},
      emailMsg: "Thanks you for your submission to macosicons.com! I'm just getting in touch with you to ask if you could ..., otherwise the icons won't work propperly. You can either email me back or re-submit the icons on macosicons.com. Thanks again, Elias webbites.io",
      approvedIcons: {}
    }
  },

  components:{
    Header
  },

  methods:{

    prettifyName(name){
      for(let i in name){
        name = name.replace("_", " ")
      }
      return name
    },

    approveIcon(icon){  
      console.log(icon);
      
      functions.useFunctionsEmulator("http://localhost:5001")
      const convertToIcns = functions.httpsCallable("convertToIcns");

      convertToIcns(icon).then(result =>{
        console.log(result.data);
      })
    }

  },

  mounted: function(){  

      let parent = this

      db.collection("submissions").where("approved", "==", false)
        .get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {

            // console.log(doc.id);

            let docData = doc.data();
            docData.imgUrl = ""

            let usersName = docData.usersName
            let appName = docData.appName
            let email = docData.email
            let creditUrl = docData.credit
            let id = doc.id
            
            docData.id = id
            // let timeStamp = doc.data().timeStamp
            // let date = new Date(timeStamp).toLocaleDateString("en-GB")

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
      })

      // db.collection("submissions").where("approved", "==", true)
      //   .get().then(function(querySnapshot) {
      //     querySnapshot.forEach(function(doc) {
      //       parent.approvedIcons[doc.data().appName] = doc.data()
      //     })
      // })


  },

  computed:{
  }

}

</script>

<style>
@import '/components/app.css';
@import '/components/snack-helper.min.css';
</style>