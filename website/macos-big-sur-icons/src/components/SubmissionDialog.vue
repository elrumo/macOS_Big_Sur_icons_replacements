<template>
  <coral-dialog id="submissionDialog" focusOnShow="off">

    <coral-dialog-header>
      Submit an icon
    </coral-dialog-header>
    
    <coral-dialog-content class="coral-dialog-content" style="height: 100%">

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</coral-progress>
        </div>
      </div>

      <div class="icon-upload-grid coral-Well coral-card">
        <coral-fileupload
          v-if="!imageData"
          name="file"
          @change="selectIcon"
          class="m-auto fileupload-wrapper"
          accept="image/png" multiple
        >
          <div coral-fileupload-select="" coral-fileupload-dropzone="" class=""> 
            <div class="fileUpload-dropZone drop-zone"> 
              <div class="h-full">
                <div class="drop-zone-wrapper">
                  <coral-icon class="m-auto" :icon="coralIcons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                  <span class="m-auto"> Add/drop files </span>
                </div>
              </div>
            </div>
          </div>
        </coral-fileupload>
        

        <div v-if="imageData" class="upload-card-wrapper">
          
          <div v-for="icon in filesToShow" :key="icon.randId" class="upload-card coral-Well">

            <div class="icon-preview">
              <img :src="icon.img" :alt="icon.name+' preview'">
              <coral-quickactions placement="center" target="_prev">
                <coral-quickactions-item
                  type="button" 
                  @click="removeFile($event, icon.randId)" 
                  :id="icon.name" 
                  :icon="coralIcons.delete"
                >
                  Remove file
                </coral-quickactions-item>
              </coral-quickactions>
            </div>

            <form class="coral-FormGroup m-0 p-l-5" style="width: calc(100% - 5px)">
              
              <div class="coral-FormGroup-item">
                <label :id="'appNameLabel'+icon.randId" class="coral-FieldLabel">
                  App name
                </label>
                <input
                  :id="'appNameUploadField'+icon.randId"
                  is="coral-textfield"
                  :labelledby="'appNameLabel'+icon.randId"
                  class="coral-Form-field"
                  type="text"
                  :value="icon.name"
                  v-on:change="getTextFieldValue($event, icon.randId, 'name')"
                >
              </div>

              <div class="coral-FormGroup-item">
                <label :id="'categoryUploadLabel'+icon.randId" class="coral-FieldLabel">
                  App category
                </label>
                <select
                  name="categoryUploadField"
                  :id="'categoryUploadField'+icon.randId"
                  placeholder="Select category"
                  class="dropdown-select"
                  v-on:change="getSelectValue($event, icon.randId, 'category')"
                >
                  <option
                    v-for="category in categoriesList"
                    :key="category.CategoryName+icon.randId+Math.floor(Math.random() * 10000000 + 1)"
                    :value="category.objectId"
                  >
                    {{ category.CategoryName }}
                  </option>
                </select>
              </div>

              <div class="coral-FormGroup-item">
                <label :id="'appWebsiteUploadLabel'+icon.randId" class="coral-FieldLabel">
                  App website
                </label>
                <input
                  :id="'appWebsiteUploadField'+icon.randId"
                  is="coral-textfield"
                  :labelledby="'appWebsiteUploadLabel'+icon.randId"
                  class="coral-Form-field"
                  type="url"
                  v-on:change="getTextFieldValue($event, icon.randId, 'appWebsite')"
                >
              </div>
              
              <div>
                <coral-checkbox
                  id="isDarkUpload"
                  v-on:change="getCheckedValue($event, icon.randId, 'isDarkMode')"
                >
                  Is dark mode
                </coral-checkbox>
              </div>

            </form>
          </div>

          <coral-fileupload name="file" @change="selectIcon" id="uploadFileGrid" class="m-auto fileupload-wrapper" accept="image/png" multiple>
            <div coral-fileupload-dropzone="" class=""> 
              <div class="fileUpload-dropZone drop-zone">
                <div class="h-full">
                  <div class="drop-zone-wrapper">
                    <coral-icon class="m-auto" :icon="coralIcons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                    <span class="m-auto"> Add/drop files </span>
                  </div>
                </div>
              </div>
            </div>
          </coral-fileupload>

        </div>
      </div>
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>
      <button is="coral-button" variant="cta" @click="onUpload">Upload</button>
      <!-- <button v-if="imageData && email != '' " is="coral-button" variant="cta" @click="onUpload">Upload</button> -->
      <!-- <button v-if="!imageData || email == '' " is="coral-button" disabled>Upload</button> -->
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex';
import Parse from 'parse'

Parse.initialize("macOSicons");
Parse.serverURL = 'https://media.macosicons.com/parse'

export default {
    name:"SubmissionDialog",
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
        isLoading: false,
        // categoriesList: [{CategoryName: "test"}, {CategoryName: "Test 2"}]
        categoriesList: []
      }
    },

    methods:{
      ...mapActions(['showToast']),

      getSelectValue(e, appName, field){
        let parent = this
        let selectedValue = e.target.value
        let category = parent.categoriesList.find(elemnt => elemnt.objectId == selectedValue)
        console.log("category: ", category);

        parent.filesToShow[appName][field] = category
      },

      getCheckedValue(e, appName, field){
        let parent = this
        let fieldValue = e.target.checked
        console.log(appName);
        parent.filesToShow[appName][field] = fieldValue
      },

      getTextFieldValue(e, appName, field){
        let parent = this
        let fieldValue = e.target.value
        console.log(fieldValue);
        parent.filesToShow[appName][field] = fieldValue
      },

      removeFile(e, randId){
        let parent = this
        Vue.delete(parent.filesToShow, randId)
        Vue.delete(parent.filesToUpload, randId)
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
          let randId = Math.floor(Math.random() * 10000000 + 1)+"-"+fileName+Object.keys(parent.filesToShow).length
          parent.filesToUpload[randId] = file
          // Create URL of file to dislay back the image
          const objectURL = window.URL.createObjectURL(file);
          let value = {
            img: objectURL,
            name: fileName,
            file: file,
            isDarkMode: false,
            category: "",
            appWebsite: "",
            randId: randId
          }
          parent.$set(parent.filesToShow, randId, value)
        }
        parent.totalNumFiles = Object.keys(parent.filesToShow).length
        parent.imageData = true
      },

      async onUpload(){
        let parent = this
        
        // Get today's date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        window.plausible("IconSubmission", {props: { date: today}})

        parent.isLoading = true
        let dialog = document.getElementById('submissionDialog')

        for(let fileNum in parent.filesToShow){
          console.log("filesToShow[fileNum]: ", parent.filesToShow[fileNum]);
          console.log("fileNum: ", fileNum);
          let file =  parent.filesToShow[fileNum].file;
          let appName = parent.filesToShow[fileNum].name;
          let randId = parent.filesToShow[fileNum].randId;
          let category = parent.filesToShow[fileNum].category.categoryObj;
          let fileName;
          
          if (/^[A-Za-z][A-Za-z0-9]*$/.test(appName)) {
            fileName = appName
          } else {
            let d = new Date()
            fileName = Math.round(Math.random()*10000 + d.getTime() )
            fileName = fileName.toString()
          }
          console.log(fileName, file.name);
          
          const Icons = Parse.Object.extend("Icons2");
          const icons = new Icons()

          const parseFile = new Parse.File(fileName, file); // Set file to new Parse object
          parseFile.save().then((uploaded) => {
            console.log("Success: ", uploaded._url);
            let iconUrl = uploaded._url.replace('http:', "https:")
            let currentUser = Parse.User.current()
          
            let dataToStore = {
              appName: appName,
              fileName: fileName,
              highResPngFile: parseFile,
              highResPngUrl: iconUrl,
              timeStamp: Date.now(),
              approved: false,
              user: currentUser,
              category: category
            }

            icons.set(dataToStore);
            icons.save().then((icon) => { // Reset input boxes
              
              // Add icon relationship to user
              let userRelation = currentUser.relation("icons")
              userRelation.add(icons)
              currentUser.save().then().catch((error) =>{
                console.log("error: ", error)
              });

              icon.set("alogliaID", icons.id);
              icon.save().then().catch((error) =>{
                console.log("error: ", error)
              });

                parent.imageData = {}
                parent.picture= null
                parent.uploadProgress++
                console.log("Document successfully written!");
                
                Vue.delete(parent.filesToShow, randId)
                Vue.delete(parent.filesToUpload, randId)
               if (Object.keys(parent.filesToUpload).length === 0) {
                  parent.isLoading = false
                  parent.imageData = false
                  parent.uploadProgress = 0

                  parent.showToast({
                    id: "toastMessage",
                    message: "✅ 😄 All icons have been uploaded.",
                    variant: "success"
                  })
                  dialog.hide()
                }
            },(error)=>{
              console.log("Data NOT saved: ", error);
            })
          }, function(error) {
            console.log("error: ", error);
            parent.isLoading = false
            parent.showToast({
              id: "toastMessage",
              message: "There was an error, get in touch @elrumo on Twitter",
              variant: "error"
            })
            // The file either could not be read, or could not be saved to Parse.
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
      
      setYourName(e){
        console.log(e.target.value);
        this.yourName = e.target.value
      },
    },

    mounted: function(){ 
      let parent = this

      let Categories = Parse.Object.extend("Categories");
      let categories = new Parse.Query(Categories)
      

      categories.find().then((results)=>{
        for(let result in results){
          let parseResult = JSON.parse(JSON.stringify(results[result]));
          
          let categoryObj = {
            objectId: parseResult.objectId,
            CategoryName: parseResult.CategoryName,
            categoryObj: results[result]
          }

          parent.categoriesList.push(categoryObj)
          // parent.categoriesList.categories[objectId] = results[result]
        }
      }).catch((error)=>{
        console.log("error: ", error);
      })

    }
}
</script>

<style>
</style>