<template>
  <coral-dialog id="submitIcon">

    <coral-dialog-header>
      Submit an icon
    </coral-dialog-header>
    
    <coral-dialog-content>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <!-- <coral-wait size="M" class="loading-animation"></coral-wait> -->
          <coral-progress indeterminate>Uploading icon</coral-progress>
        </div>
      </div>

      <div class="icon-upload-grid">
        
        <img class="icon-preview" :src="picture">
        <coral-quickactions placement="center" target="_prev">
          <coral-quickactions-item type="button" @click="removeFile" :icon="icons.delete">Remove file</coral-quickactions-item>
        </coral-quickactions>

        <coral-fileupload v-if="!picture" name="file" @change="selectIcon" class="m-auto" accept="image/png">
          <div coral-fileupload-dropzone=""  class="fileUpload-dropZone drop-zone"> 
            <div class="h-full" coral-fileupload-select="">
              <div class="drop-zone-wrapper">
                <coral-icon class="m-auto" :icon="icons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                <span class="m-auto"> Drop files... </span>
              </div>
            </div>
          </div>
        </coral-fileupload>
        
        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="appName-label" class="coral-FieldLabel">Name of app</label>
          <input id="appName-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setAppName">
        </form>

        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="email-label" class="coral-FieldLabel">Your email</label>
          <input id="email-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" type="email"  v-on:change="setEmail">
        </form>

        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="yourName-label" class="coral-FieldLabel">Your name <span style="opacity: 0.5"><i>(optional)</i></span></label>
          <input id="yourName-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setYourName">
        </form>

        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="credit-label" class="coral-FieldLabel">How should we credit you? <span style="opacity: 0.5"><i>(optional)</i></span></label>
          <input id="credit" is="coral-textfield" placeholder="Twitter URL, portfolio site..." labelledby="email-label" class="coral-Form-field" @change="saveCredit">
        </form>

      </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>
      <button v-if="imageData != null && email != '' && appName != ''" is="coral-button" variant="cta" @click="onUpload">Upload</button>
      <button v-if="imageData == null || email == '' || appName == ''" is="coral-button" disabled>Upload</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import * as firebase from "firebase";
import { mapActions } from 'vuex';

let firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "macos-icons.firebaseapp.com",
  databaseURL: "https://macos-icons.firebaseio.com",
  projectId: "macos-icons",
  storageBucket: "macos-icons.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let storage = firebase.storage();
// var storageRef = storage.ref();
// var publicIconsRef = storageRef.child('icon_submissions');
// console.log(publicIconsRef);

export default {
    name:"Dialog",

    props:{
    },

    data(){
      return{
        imageData: null,
        picture: null,
        uploadValue: 0,
        icons:{
          addIcon: require("../assets/icons/add.svg"),
          delete: require("../assets/icons/delete.svg"),
          newItem: require("../assets/icons/newItem.svg"),
        },
        yourName: "",
        email: "",
        appName: "",
        credit: "",
        isLoading: false
      }
    },

    methods:{
      ...mapActions(['showToast']),

      removeFile(){
        this.imageData = null
        this.picture = null
      },

      selectIcon(event) {
        // Get selected image
        let file = event.target.uploadQueue[0]._originalFile
        console.log(file);
        const objectURL = window.URL.createObjectURL(file);
        this.picture = objectURL;
        this.imageData = file
        this.uploadValue = 0;
      },

      async onUpload(){
        let parent = this
        parent.isLoading = true
        let dialog = document.getElementById('submitIcon')

        let randomId = Math.floor(Math.random() * 1000 + Date.now())
        let fileName = randomId+'_'+`${parent.imageData.name}`

        await storage.ref('icon_submissions/'+fileName).put(parent.imageData).then((value)=>{
          value.ref.getDownloadURL().then(function() {
            console.log(value);
            // Add a new document in collection "cities"
            db.collection("submissions").doc().set({
                appName: parent.appName,
                usersName: parent.yourName,
                email: parent.email,
                credit: parent.credit,
                fileName: fileName,
                iconRef: value.ref.fullPath,
                timeStamp: Date.now(),
                approved: false
            })
            .then(function() {
              parent.isLoading = false,
              parent.imageData = null,
              parent.picture= null,
              parent.email = ""
              parent.name = ""
              console.log("Document successfully written!");
              dialog.hide()
              parent.showToast()
              
              function clearInput(id){
                document.getElementById(id).value = ""
              }
              clearInput("credit")
              clearInput("yourName-contributor")
              clearInput("email-contributor")
              clearInput("appName-contributor")


            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
              parent.isLoading = false
            });

          });
        });
      },

      setEmail(e){
        console.log(e.target.value);
        this.email = e.target.value
      },
      setAppName(e){
        console.log(e.target.value);
        this.appName = e.target.value
      },
      setYourName(e){
        console.log(e.target.value);
        this.yourName = e.target.value
      },
      saveCredit(e){
        console.log(e.target.value);
        this.credit = e.target.value
      },

    },
}
</script>

<style>

</style>