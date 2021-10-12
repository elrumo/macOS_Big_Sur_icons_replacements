<template>

  <coral-dialog id="uploadDialog">
    <coral-dialog-header>Are you sure you want to delete {{icon.appName}}?</coral-dialog-header>
    
    <coral-dialog-content>  
        <coral-fileupload name="file" class="m-auto" accept="image/png" multiple>
        <div coral-fileupload-dropzone=""  class="fileUpload-dropZone drop-zone"> 
          <div class="h-full" coral-fileupload-select="">
            <div class="drop-zone-wrapper">
              <coral-icon class="m-auto" icon="add" size="L" alt="Add Icon" title="XL"></coral-icon>
              <span class="m-auto"> Add/drop files </span>
            </div>
          </div>
      </div>
    </coral-fileupload>
    </coral-dialog-content>

    <coral-dialog-footer>
        <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
        <button is="coral-button" variant="warning" coral-close="" @click="deleteIcon(icon)">Delete</button>
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
    name:"UploadDialog",

    props:{
      icon: {}
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
        
        // Get today's date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        window.plausible("IconSubmission", {props: { date: today}})

        parent.isLoading = true
        let dialog = document.getElementById('submitIcon')
        let isReupload = document.getElementById('isReupload').checked
        let isAuthor = document.getElementById('isAuthor').checked

        for(let fileNum in parent.filesToUpload){
          let file =  parent.filesToUpload[fileNum];
          let appName = file.name.replace('.png', '');
          let fileName;
          
          if (/^[A-Za-z][A-Za-z0-9]*$/.test(file.name)) {
            fileName = `${file.name}`
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
              email: parent.email,
              credit: parent.credit,
              usersName: parent.yourName,
              uploadedBy: parent.yourName,
              fileName: fileName,
              highResPngFile: parseFile,
              highResPngUrl: iconUrl,
              isReupload: isReupload,
              isAuthor: isAuthor,
              timeStamp: Date.now(),
              approved: false,
              user: currentUser
            }

            icons.set(dataToStore);
            icons.save().then((icon) => { // Reset input boxes
              
              // Add icon relationship to user
              let userRelation = currentUser.relation("icons")
              userRelation.add(icons)
              currentUser.save()

              icon.set("alogliaID", icons.id);
              icon.save();

              parent.imageData = {},
                parent.picture= null,
                parent.uploadProgress++
                console.log("Document successfully written!");
                
                function clearInput(id){
                  document.getElementById(id).value = ""
                }
                
                Vue.delete(parent.filesToUpload, appName)
                Vue.delete(parent.filesToShow, appName)
               if (Object.keys(parent.filesToUpload).length === 0) {
                  parent.isLoading = false
                  parent.imageData = false
                  parent.email, parent.name = ""
                  parent.uploadProgress = 0
                  
                  let inputs = ["credit", "email-contributor", "yourName-contributor"]
                  for(let i in inputs){
                    clearInput(inputs[i])  
                  }

                  parent.showToast({
                    id: "toastMessage",
                    message: "All icons have been uploaded.",
                    variant: "success"
                  })
                  dialog.hide()
                }
            },(error)=>{
              console.log("Data NOT saved: ", error);
            })
          }, function(error) {
            console.log(error);
            parent.isLoading = false
            parent.showToast({
              id: "toastMessage",
              message: "There was an error, get in touch with @elrumo on Twitter",
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