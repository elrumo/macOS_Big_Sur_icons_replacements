<template>
  <coral-dialog id="uploadDialog">
    <coral-dialog-header>Are you sure you want to delete {{icon.appName}}?</coral-dialog-header>
    
    <coral-dialog-content>
      <div v-if="imageData && Object.keys(filesToShow).length > 0" class="selected-files">
        <div v-for="(file, name) in filesToShow" :key="name" class="selected-file">
          <img :src="file.img" :alt="file.name" class="preview-image"/>
          <span class="file-name">{{ file.name }}</span>
        </div>
      </div>
      
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

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js';

const props = defineProps({
  icon: {
    type: Object,
    default: () => ({})
  }
})

const store = useStore()

// State
const imageData = ref(false)
const filesToShow = reactive({})
const filesToUpload = reactive({})
const uploadProgress = ref(0)
const totalNumFiles = ref(0)
const email = ref("")
const credit = ref("")
const appName = ref("")
const yourName = ref("")
const isLoading = ref(false)

// Store actions
function showToast(payload) {
  store.dispatch('showToast', payload)
}

function selectIcon(event) {
  const files = event.target.uploadQueue

  for (let fileNum in files) {
    const file = files[fileNum].file
    const fileName = file.name.replace('.png', '')
    filesToUpload[fileName] = file
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
  try {
    isLoading.value = true

    const today = new Date().toLocaleDateString()
    window.plausible("IconSubmission", { props: { date: today } })

    const dialog = document.getElementById('submitIcon')
    const isReupload = document.getElementById('isReupload').checked
    const isAuthor = document.getElementById('isAuthor').checked
    const currentUser = Parse.User.current()

    for (const [currentAppName, file] of Object.entries(filesToUpload)) {
      try {
        const fileName = generateFileName(file.name)
        const parseFile = await uploadFileToParse(fileName, file)

        const icon = await createIconRecord({
          appName: currentAppName.replace('.png', ''),
          fileName,
          parseFile,
          iconUrl: parseFile._url.replace('http:', 'https:'),
          isReupload,
          isAuthor,
          currentUser
        })

        await addIconToUser(icon, currentUser)
        cleanupFileUpload(currentAppName)

        if (Object.keys(filesToUpload).length === 0) {
          await resetUploadState(dialog)
        }

      } catch (error) {
        console.error(`Error processing file ${currentAppName}:`, error)
        showToast({
          id: "toastMessage",
          message: `Error uploading ${currentAppName}: ${error.message}`,
          variant: "error"
        })
      }
    }

  } catch (error) {
    console.error('Upload error:', error)
    showToast({
      id: "toastMessage",
      message: "Upload failed. Please try again or contact support.",
      variant: "error"
    })
  } finally {
    isLoading.value = false
  }
}

function generateFileName(originalName) {
  if (/^[A-Za-z][A-Za-z0-9]*$/.test(originalName)) {
    return originalName
  }
  return Date.now() + Math.round(Math.random() * 10000).toString()
}

async function uploadFileToParse(fileName, file) {
  const parseFile = new Parse.File(fileName, file)
  await parseFile.save({ ACL: new Parse.ACL().setPublicReadAccess(true) })
  return parseFile
}

async function createIconRecord({ appName: iconAppName, fileName, parseFile, iconUrl, isReupload, isAuthor, currentUser }) {
  const Icons = Parse.Object.extend("Icons2")
  const icon = new Icons()

  const iconData = {
    appName: iconAppName,
    email: email.value,
    credit: credit.value,
    usersName: yourName.value,
    uploadedBy: yourName.value,
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
}

async function addIconToUser(icon, user) {
  const userRelation = user.relation("icons")
  userRelation.add(icon)
  return user.save()
}

function cleanupFileUpload(appNameToClean) {
  delete filesToUpload[appNameToClean]
  delete filesToShow[appNameToClean]
  uploadProgress.value++
}

async function resetUploadState(dialog) {
  imageData.value = false
  email.value = ''
  uploadProgress.value = 0

  const inputs = ["credit", "email-contributor", "yourName-contributor"]
  inputs.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.value = ''
  })

  showToast({
    id: "toastMessage",
    message: "All icons have been uploaded.",
    variant: "success"
  })

  dialog.hide()
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
.selected-files {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: #f5f5f5;
}

.selected-file {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.preview-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 1rem;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
