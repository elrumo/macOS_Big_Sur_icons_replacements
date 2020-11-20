<template>
  <coral-dialog id="submitIcon">

    <coral-dialog-header>
      Submit an icon
    </coral-dialog-header>
    
    <coral-dialog-content>
      
      <div class="dialog-text">
        <b> We'll let you know by email when the icon has been approved. </b>
        <br>
        <ul class="coral-List p-t-10 p-b-10">
          <li class="coral-List-item">Icon submited must be a .png file</li>
          <li class="coral-List-item">Use <a href="https://github.com/elrumo/macOS_Big_Sur_icons_replacements/raw/master/design/Template-Icon-App.sketch" class="coral-Link">this </a> template for dimensions and reference.</li>
          <li class="coral-List-item"> <b> The file name must be the same as the name of the app. </b></li>
        </ul>

        <!-- , submit a .png file with at least a height of 1048px and make sure <b>the file name is the name of the app.</b> -->
      </div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <!-- <coral-wait size="M" class="loading-animation"></coral-wait> -->
          <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</coral-progress>
        </div>
      </div>

      <div class="icon-upload-grid">
        
        <div v-if="imageData" class="icons-preview-wrapper">
          
          <div v-for="icon in filesToShow" class="icon-preview" :key="icon.name">
            <img :src="icon.img">
            <coral-quickactions placement="center" target="_prev">
              <coral-quickactions-item type="button" @click="removeFile" :id="icon.name" :icon="coralIcons.delete">Remove file</coral-quickactions-item>
            </coral-quickactions>
          </div>

           <coral-fileupload name="file" @change="selectIcon" class="m-auto" accept="image/png" multiple>
            <div coral-fileupload-dropzone=""  class="fileUpload-dropZone drop-zone"> 
              <div class="h-full" coral-fileupload-select="">
                <div class="drop-zone-wrapper">
                  <coral-icon class="m-auto" :icon="coralIcons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                  <span class="m-auto"> Add/drop files </span>
                </div>
              </div>
            </div>
          </coral-fileupload>

        </div>

        <coral-fileupload v-if="!imageData" name="file" @change="selectIcon" class="m-auto" accept="image/png" multiple>
          <div coral-fileupload-dropzone=""  class="fileUpload-dropZone drop-zone"> 
            <div class="h-full" coral-fileupload-select="">
              <div class="drop-zone-wrapper">
                <coral-icon class="m-auto" :icon="coralIcons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                <span class="m-auto"> Add/drop files </span>
              </div>
            </div>
          </div>
        </coral-fileupload>

        <form class="coral-Form coral-Form--vertical" >
          <label id="email-label" class="coral-FieldLabel">Your email</label>
          <input id="email-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" type="email"  v-on:change="setEmail">
        </form>

        <form class="coral-Form coral-Form--vertical" >
          <label id="yourName-label" class="coral-FieldLabel">Your name</label>
          <!-- <label id="yourName-label" class="coral-FieldLabel">Your name <span style="opacity: 0.5"><i>(optional)</i></span></label> -->
          <input id="yourName-contributor" is="coral-textfield" labelledby="email-label" class="coral-Form-field" @change="setYourName">
        </form>

        <form class="coral-Form coral-Form--vertical" >
          <!-- <label id="credit-label" class="coral-FieldLabel">How should we credit you? <span style="opacity: 0.5"><i>(optional)</i></span></label> -->
          <label id="credit-label" class="coral-FieldLabel">How should we credit you?</label>
          <input id="credit" is="coral-textfield" type="url" placeholder="MAKE SURE IT'S A FULL URL: GitHub, Twitter, portfolio site... " labelledby="email-label" class="coral-Form-field" @change="saveCredit">
        </form>

      </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>
      <button v-if="imageData && email != '' " is="coral-button" variant="cta" @click="onUpload">Upload</button>
      <button v-if="!imageData || email == '' " is="coral-button" disabled>Upload</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex';
import * as firebase from "firebase";
// import * as firebaseui from "firebaseui";

let firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
  authDomain: "macos-icons.firebaseapp.com",
  databaseURL: "https://macos-icons.firebaseio.com",
  projectId: "macos-icons",
  storageBucket: "macos-icons.appspot.com"
};


  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let storage = firebase.storage();

export default {
    name:"Dialog",

    props:{
    },

    data(){
      return{
        imageData: false,
        filesToShow: {},
        filesToUpload: {},

        coralIcons:{
          addIcon: require("../assets/icons/add.svg"),
          delete: require("../assets/icons/delete.svg"),
          newItem: require("../assets/icons/newItem.svg"),
        },

        uploadProgress: 0,
        totalNumFiles: 0,

        email: "",
        credit: "",
        appName: "",
        yourName: "",

        isLoading: false
      }
    },

    methods:{
      ...mapActions(['showToast']),

      removeFile(e){
        let parent = this
        let iconName = e.target.id;

        Vue.delete(parent.filesToShow, iconName)
        Vue.delete(parent.filesToUpload, iconName)

        // If imageURL is empty, show the upload files component
        if (Object.keys(parent.filesToShow).length === 0) {
          parent.imageData = false
        }
      },

      selectIcon(event) {
        // Get selected image
        let parent = this
        let files = event.target.uploadQueue
        
        // Go through all the files that have been selected
        for(let fileNum in files){
          let file = files[fileNum].file
          let fileName = file.name.replace('.png', '')
          parent.filesToUpload[fileName] = file

          // Create URL of file to dislay back the image
          const objectURL = window.URL.createObjectURL(file);
          let value = {
            img: objectURL,
            name: fileName
          }
          parent.$set(parent.filesToShow, fileName, value)
        }

        parent.totalNumFiles = Object.keys(parent.filesToShow).length
        parent.imageData = true
        
      },


      async onUpload(){
        let parent = this
        parent.isLoading = true
        let dialog = document.getElementById('submitIcon')

        let randomId = Math.floor(Math.random() * 1000 + Date.now())

        for(let fileNum in parent.filesToUpload){
          let file =  parent.filesToUpload[fileNum];
          let appName = file.name.replace('.png', '');
          let fileName = randomId+'_'+`${file.name}`;

          console.log(fileName);
          
          await storage.ref('icon_submissions/'+fileName).put(file).then((value)=>{
            value.ref.getDownloadURL().then(function() {
              console.log(value);
              // Add a new document in collection "cities"
              db.collection("submissions").doc().set({
                  appName: appName,
                  email: parent.email,
                  credit: parent.credit,
                  usersName: parent.yourName,
                  fileName: fileName,
                  iconRef: value.ref.fullPath,
                  timeStamp: Date.now(),
                  approved: false
              })
              .then(()=>{
                parent.imageData = {},
                parent.picture= null,
                parent.uploadProgress++
                console.log("Document successfully written!");
                
                function clearInput(id){
                  document.getElementById(id).value = ""
                }
                
                Vue.delete(parent.filesToUpload, appName)
                Vue.delete(parent.filesToShow, appName)
                
                // Only hide dialog if all items have been uploaded
                if (Object.keys(parent.filesToUpload).length === 0) {
                  parent.isLoading = false
                  parent.imageData = false
                  parent.email = ""
                  parent.name = ""
                  parent.uploadProgress = 0
                  
                  clearInput("credit")
                  clearInput("email-contributor")
                  clearInput("yourName-contributor")

                  parent.showToast()
                  dialog.hide()
                }

              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
                // parent.isLoading = false
              });

            });
          });          
        }

      },

      setEmail(e){
        console.log(e.target.value);
        this.email = e.target.value
      },
      saveCredit(e){
        console.log(e.target.value);
        this.credit = e.target.value
      },
      // setAppName(e){
      //   console.log(e.target.value);
      //   this.appName = e.target.value
      // },
      setYourName(e){
        console.log(e.target.value);
        this.yourName = e.target.value
      },

    },
}
</script>

<style>

</style>