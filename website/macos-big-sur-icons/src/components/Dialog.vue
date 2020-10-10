<template>
  <coral-dialog id="submitIcon">

    <coral-dialog-header>Submit an icon</coral-dialog-header>
    
    <coral-dialog-content>

      <div class="coral-Well icon-upload-grid">
      
        <img class="icon-preview" :src="picture">

        <coral-fileupload v-if="!imageData" name="file" @change="selectIcon" class="m-auto">
          <div coral-fileupload-dropzone=""  class="fileUpload-dropZone drop-zone"> 
            <div class="drop-zone-wrapper" coral-fileupload-select="">
              <coral-icon class="m-auto" :icon="addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
              <span class="m-auto"> Drop files... </span>
            </div>
          </div>
        </coral-fileupload>
        
        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="appName-label" class="coral-FieldLabel">App Name</label>
          <input id="appName-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setAppName">
        </form>

        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="email-label" class="coral-FieldLabel">Email</label>
          <input id="email-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setEmail">
        </form>

        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="yourName-label" class="coral-FieldLabel">Your Name</label>
          <input id="yourName-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setYourName">
        </form>

      </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>

      <button v-if="imageData != null" is="coral-button" variant="cta" @click="onUpload" coral-close="">Upload</button>
      <button v-if="imageData == null" is="coral-button" disabled coral-close="">Upload</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import * as firebase from "firebase";

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
let storage = firebase.storage();
var storageRef = storage.ref();
var publicIconsRef = storageRef.child('icon_submissions');
console.log(publicIconsRef);

export default {
    name:"Dialog",

    props:{
    },

    data(){
      return{
        imageData: null,
        picture: null,
        uploadValue: 0,
        addIcon: require("../assets/add.svg"),
        yourName: String,
        email: String,
        appName: String
      }
    },

    methods:{

      selectIcon(event) {
        // Get selected image
        let file = event.target.children[0].children[1].files[0]
        const objectURL = window.URL.createObjectURL(file);
        this.picture = objectURL;
        this.imageData = file
        this.uploadValue = 0;
      },

      async onUpload(){
        let parent = this
        parent.picture = null;
        // console.log(parent.imageData.name);
        await firebase.storage().ref('icon_submissions/'+`${parent.imageData.name}`).put(parent.imageData).then((value)=>{
          value.ref.getDownloadURL().then(function(url) {
            parent.picture = url
            parent.imageData = null
            parent.email = String
            parent.name = String
          });
        });
      },

      setEmail(e){
        this.email = e.target.value
      },
      setAppName(e){
        this.appName = e.target.value
      },
      setYourName(e){
        this.yourName = e.target.value
      },

    },
}
</script>

<style>

</style>