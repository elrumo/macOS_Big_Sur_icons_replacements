<template>
  <coral-dialog id="submitIcon">

    <coral-dialog-header>
      Submit an icon
    </coral-dialog-header>
    
    <coral-dialog-content>

      <div class="dialog-text">
        <b> We'll let you know by email when the icon has been approved. </b>
        <br>
        <ul class="coral-List p-t-8 p-b-8">
          <li class="coral-List-item">Icon submitted must be a .png file</li>
          <li class="coral-List-item">
            Download template from the <router-link coral-close="" to="/resources"> <b> resources page. </b></router-link>
          </li>
          <li class="coral-List-item"> <b> The file name must be the same as the name of the app. </b></li>
        </ul>
      </div>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
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

        <!-- <form class="coral-Form coral-Form--vertical" > -->
        <!-- </form> -->

        <section class="p-t-4">
          <div>
            <coral-checkbox id="isReupload">
              I'm re-uploading an icon that was previously on the site
            </coral-checkbox>
          </div>

          <div>
            <coral-checkbox id="isAuthor">I'm the original author of these icons. 
              <span class="opacity-80 p-l-4 f-w-200 coral-Body--XS">
                (It's ok if you aren't)
              </span>
            </coral-checkbox>
          </div>
        </section>

      </div>
  
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">Cancel</button>
      <button v-if="imageData && email != '' " is="coral-button" variant="cta" @click="onUpload">Upload</button>
      <button v-if="!imageData || email == '' " is="coral-button" disabled>Upload</button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js'

import addIcon from "../assets/icons/add.svg"
import deleteIcon from "../assets/icons/delete.svg"
import newItemIcon from "../assets/icons/newItem.svg"

const store = useStore()

const imageData = ref(false)
const filesToShow = reactive({})
const filesToUpload = reactive({})
const coralIcons = {
  addIcon: addIcon,
  delete: deleteIcon,
  newItem: newItemIcon,
}
const uploadProgress = ref(0)
const totalNumFiles = ref(0)
const email = ref("")
const credit = ref("")
const appName = ref("")
const yourName = ref("")
const isLoading = ref(false)

function showToast(payload) {
  store.dispatch('showToast', payload)
}

function removeFile(e) {
  const iconName = e.target.id
  delete filesToShow[iconName]
  delete filesToUpload[iconName]
  // If imageURL is empty, show the upload files component
  if (Object.keys(filesToShow).length === 0) {
    imageData.value = false
  }
}

function selectIcon(event) {
  // Get selected image
  const files = event.target.uploadQueue

  // Go through all the files that have been selected
  for (let fileNum in files) {
    const file = files[fileNum].file
    const fileName = file.name.replace('.png', '')
    filesToUpload[fileName] = file
    // Create URL of file to display back the image
    const objectURL = window.URL.createObjectURL(file)
    filesToShow[fileName] = {
      img: objectURL,
      name: fileName
    }
  }
  totalNumFiles.value = Object.keys(filesToShow).length
  imageData.value = true
}

async function onUpload() {
  // Get today's date
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  const yyyy = today.getFullYear()

  today = dd + '/' + mm + '/' + yyyy

  window.plausible("IconSubmission", { props: { date: today } })

  isLoading.value = true
  const dialog = document.getElementById('submitIcon')
  const isReupload = document.getElementById('isReupload').checked
  const isAuthor = document.getElementById('isAuthor').checked

  for (let fileNum in filesToUpload) {
    const file = filesToUpload[fileNum]
    const currentAppName = file.name.replace('.png', '')
    let fileName

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(file.name)) {
      fileName = `${file.name}`
    } else {
      const d = new Date()
      fileName = Math.round(Math.random() * 10000 + d.getTime())
      fileName = fileName.toString()
    }

    const Icons = Parse.Object.extend("Icons2")
    const icons = new Icons()

    const parseFile = new Parse.File(fileName, file) // Set file to new Parse object
    parseFile.save().then((uploaded) => {
      console.log("Success: ", uploaded._url)
      const iconUrl = uploaded._url.replace('http:', "https:")
      const currentUser = Parse.User.current()

      const dataToStore = {
        appName: currentAppName,
        email: email.value,
        credit: credit.value,
        usersName: yourName.value,
        uploadedBy: yourName.value,
        fileName: fileName,
        highResPngFile: parseFile,
        highResPngUrl: iconUrl,
        isReupload: isReupload,
        isAuthor: isAuthor,
        timeStamp: Date.now(),
        approved: false,
        user: currentUser
      }

      icons.set(dataToStore)
      icons.save().then((icon) => { // Reset input boxes

        // Add icon relationship to user
        const userRelation = currentUser.relation("icons")
        userRelation.add(icons)
        currentUser.save()

        icon.set("alogliaID", icons.id)
        icon.save()

        imageData.value = false
        uploadProgress.value++
        console.log("Document successfully written!")

        function clearInput(id) {
          document.getElementById(id).value = ""
        }

        delete filesToUpload[currentAppName]
        delete filesToShow[currentAppName]
        if (Object.keys(filesToUpload).length === 0) {
          isLoading.value = false
          imageData.value = false
          email.value = ""
          uploadProgress.value = 0

          const inputs = ["credit", "email-contributor", "yourName-contributor"]
          for (let i in inputs) {
            clearInput(inputs[i])
          }

          showToast({
            id: "toastMessage",
            message: "All icons have been uploaded.",
            variant: "success"
          })
          dialog.hide()
        }
      }, (error) => {
        console.log("Data NOT saved: ", error)
      })
    }, function (error) {
      console.log(error)
      isLoading.value = false
      showToast({
        id: "toastMessage",
        message: "There was an error, get in touch with @elrumo on Twitter",
        variant: "error"
      })
      // The file either could not be read, or could not be saved to Parse.
    })
  }
}

function setEmail(e) {
  console.log(e.target.value)
  email.value = e.target.value
}

function saveCredit(e) {
  console.log(e.target.value)
  credit.value = e.target.value
}

function setYourName(e) {
  console.log(e.target.value)
  yourName.value = e.target.value
}
</script>

<style>
</style>