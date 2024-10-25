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
import Parse from 'parse/dist/parse.min.js';

export default {
    name: "UploadDialog",

    props:{
      icon: {}
    },
    
    data(){
      return{
        imageData: false,
        filesToShow: {},
        filesToUpload: {},
        droppedFile: null,
        coralIcons:{
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

      async onUpload() {
        try {
          this.isLoading = true
          
          const today = new Date().toLocaleDateString()
          window.plausible("IconSubmission", {props: { date: today}})

          const dialog = document.getElementById('submitIcon')
          const isReupload = document.getElementById('isReupload').checked
          const isAuthor = document.getElementById('isAuthor').checked
          const currentUser = Parse.User.current()

          for (const [appName, file] of Object.entries(this.filesToUpload)) {
            try {
              // Generate filename
              const fileName = this.generateFileName(file.name)
              
              // Upload file to Parse
              const parseFile = await this.uploadFileToParse(fileName, file)
              
              // Create icon record
              const icon = await this.createIconRecord({
                appName: appName.replace('.png', ''),
                fileName,
                parseFile,
                iconUrl: parseFile._url.replace('http:', 'https:'),
                isReupload,
                isAuthor,
                currentUser
              })

              // Add icon relationship to user
              await this.addIconToUser(icon, currentUser)

              // Cleanup UI state
              this.cleanupFileUpload(appName)

              if (Object.keys(this.filesToUpload).length === 0) {
                await this.resetUploadState(dialog)
              }

            } catch (error) {
              console.error(`Error processing file ${appName}:`, error)
              this.showToast({
                id: "toastMessage", 
                message: `Error uploading ${appName}: ${error.message}`,
                variant: "error"
              })
            }
          }

        } catch (error) {
          console.error('Upload error:', error)
          this.showToast({
            id: "toastMessage",
            message: "Upload failed. Please try again or contact support.",
            variant: "error" 
          })
        } finally {
          this.isLoading = false
        }
      },

      generateFileName(originalName) {
        if (/^[A-Za-z][A-Za-z0-9]*$/.test(originalName)) {
          return originalName
        }
        return Date.now() + Math.round(Math.random() * 10000).toString()
      },

      async uploadFileToParse(fileName, file) {
        const parseFile = new Parse.File(fileName, file)
        await parseFile.save({ ACL: new Parse.ACL().setPublicReadAccess(true) })
        return parseFile
      },

      async createIconRecord({appName, fileName, parseFile, iconUrl, isReupload, isAuthor, currentUser}) {
        const Icons = Parse.Object.extend("Icons2")
        const icon = new Icons()
        
        const iconData = {
          appName,
          email: this.email,
          credit: this.credit, 
          usersName: this.yourName,
          uploadedBy: this.yourName,
          fileName,
          highResPngFile: parseFile,
          highResPngUrl: iconUrl,
          isReupload,
          isAuthor,
          timeStamp: Date.now(),
          approved: false,
          user: currentUser
        }

        icon.set(iconData)
        const savedIcon = await icon.save()
        savedIcon.set("alogliaID", savedIcon.id)
        return savedIcon.save()
      },

      async addIconToUser(icon, user) {
        const userRelation = user.relation("icons")
        userRelation.add(icon)
        return user.save()
      },

      cleanupFileUpload(appName) {
        Vue.delete(this.filesToUpload, appName)
        Vue.delete(this.filesToShow, appName)
        this.uploadProgress++
      },

      async resetUploadState(dialog) {
        this.imageData = false
        this.email = ''
        this.name = ''
        this.uploadProgress = 0
        
        const inputs = ["credit", "email-contributor", "yourName-contributor"]
        inputs.forEach(id => document.getElementById(id).value = '')

        this.showToast({
          id: "toastMessage",
          message: "All icons have been uploaded.",
          variant: "success"
        })

        dialog.hide()
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
