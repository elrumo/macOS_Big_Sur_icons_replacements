<template>
  <coral-dialog id="submissionDialog">

    <coral-dialog-header>
      Submit an icon
      <p class="coral-Body--M p-t-8 m-b-4">
        Visit the <router-link coral-close="" to="/resources" class="coral-Link">resources page </router-link> for icon templates.
      </p>

      <p class="coral-Body--M p-t-4 p-b-4 m-b-0">
          All icons must be .png, or .icns images and have a resolution of 1024px x 1024px.
          <br>
          <b>If you're uploading a .icns file, you must also upload a high resolution .png file.</b>
      </p>


    </coral-dialog-header>
    
    <coral-dialog-content class="coral-dialog-content" style="height: 100%">

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-popup">
          <coral-progress indeterminate>{{ uploadProgress }}/{{ totalNumFiles+1 }} icons uploaded</coral-progress>
        </div>
      </div>

      <div class="icon-upload-grid ">
        
        <!-- Initial Drag to upload -->
        <coral-fileupload
          v-if="!imageData"
          name="file"
          @change="selectIcon"
          class="m-auto fileupload-wrapper"
          accept="image/png" multiple
        >
          <div
            coral-fileupload-select=""
            coral-fileupload-dropzone=""
          >
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
        
        <coral-fileupload
          v-if="imageData"
          name="file"
          @change="selectIcon"
          class="m-auto fileupload-wrapper hidden-fileuploader"
          accept="image/png" multiple
        >
          
          <div
            coral-fileupload-dropzone=""
          >
            <div class="fileUpload-dropZone drop-zone drop-zone-hidden"> 
              <div class="h-full">
                
                <div v-if="imageData" class="upload-card-wrapper">
                
                  <div v-for="icon in filesToShow" :key="icon.randId" class="upload-card coral-Well">

                    <coral-status variant="info" class="status-alert">
                      <b>Important:</b>
                      Please use the 'Check Size' button below to ensure your icon is the correct size. App icons that are not the correct size will not be approved.
                    </coral-status>

                    <div class="upload-card-content">
                      <SubmissionIconPreview
                        :icon="icon"
                        :removeFile="removeFile"
                      />

                      <form class="coral-FormGroup m-0 p-l-4" style="width: calc(100% - 5px)">
                        
                        <!-- AppName -->
                        <div class="coral-FormGroup-item">
                          <label :id="'appNameLabel'+icon.randId" class="coral-FieldLabel">
                            *App name
                          </label>
                          <input
                            is="coral-textfield"
                            class="coral-Form-field"
                            type="text"
                            required=""
                            :id="'appNameUploadField'+icon.randId"
                            :labelledby="'appNameLabel'+icon.randId"
                            :value="icon.name"
                            v-on:change="getValue($event, icon.randId, 'name')"
                          >
                        </div>
                        
                        <!-- App category -->
                        <div class="coral-FormGroup-item">
                          <label :id="'categoryUploadLabel'+icon.randId" class="coral-FieldLabel">
                            *App category
                          </label>
                          <div class="dropdown-select-chevron relative">
                            <select
                              name="categoryUploadField"
                              :id="'categoryUploadField'+icon.randId"
                              placeholder="Select category"
                              class="dropdown-select"
                              v-on:change="getValue($event, icon.randId, 'category')"
                            >
                              <option
                                value=""
                                disabled selected
                              >
                                Select category (required)
                              </option>
                              <option
                                v-for="category in getAppCategories"
                                :key="category.name+icon.randId+Math.floor(Math.random() * 10000000 + 1)"
                                :id="icon.randId+category.id"
                                :value="category.id"
                                :selected="icon.category.includes(category.id) || null"
                              >
                                {{ category.name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        
                        <!-- Type of icon -->
                        <div class="coral-FormGroup-item">
                          <label :id="'TypeUploadLabel'+icon.randId" class="coral-FieldLabel">
                            *Type of icon
                          </label>
                          <div class="dropdown-select-chevron relative">
                            <select
                              name="TypeUploadField"
                              :id="'TypeUploadField'+icon.randId"
                              placeholder="Select Type"
                              class="dropdown-select"
                              v-on:change="getValue($event, icon.randId, 'type')"
                            >
                              <option
                                v-for="type in getIconType"
                                :key="type.name+icon.randId+Math.floor(Math.random() * 10000000 + 1)"
                                :value="type.id"
                                :selected="selectedOption(type.id, icon.type)"
                              >
                                {{ type.name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        
                        <!-- App website -->
                        <div class="coral-FormGroup-item">
                          <label :id="'appWebsiteUploadLabel'+icon.randId" class="coral-FieldLabel">
                            App website (optional)
                          </label>
                          <input
                            :id="'appWebsiteUploadField'+icon.randId"
                            is="coral-textfield"
                            :labelledby="'appWebsiteUploadLabel'+icon.randId"
                            class="coral-Form-field"
                            type="url"
                            placeholder="The app's developer website"
                            v-on:change="getValue($event, icon.randId, 'appWebsite')"
                          >
                        </div>
                        
                        <!-- .icns file -->
                        <div class="coral-FormGroup-item">
                          <div>
                            <label
                              class="coral-FieldLabel"
                              for="icnsFileUpload"
                            >
                              .icns file (optional)
                            </label>

                            <button
                              is="coral-button"
                              for="icnsFileUpload"
                              @click="openFileUpload('icnsFileUpload', icon.randId)"
                            >
                              <span v-if="!filesToShow[icon.randId].icnsFile">
                                Upload .icns file
                              </span>
                              <span v-if="filesToShow[icon.randId].icnsFile">
                                Remove .icns file
                              </span>
                            </button>
                            <input
                              type="file"
                              id="icnsFileUpload"
                              accept=".icns"
                              class="hidden"
                              @change="setIcns($event, icon.randId)"
                            >
                          </div>
                        </div>
                        
                        <!-- Is dark mode -->
                        <div class="coral-FormGroup-item">
                          <coral-checkbox
                            :id="'isDarkUpload'+icon.randId"
                            v-on:change="getCheckedValue($event, icon.randId, 'isDarkMode')"
                          >
                            Is dark mode
                          </coral-checkbox>

                          <coral-checkbox
                            :id="'isLiquidGlassUpload'+icon.randId"
                            v-on:change="getCheckedValue($event, icon.randId, 'isLiquidGlass')"
                          >
                            Liquid Glass design style
                          </coral-checkbox>

                          <coral-checkbox
                            :id="'isAuthorUpload'+icon.randId"
                            v-on:change="getCheckedValue($event, icon.randId, 'isAuthor')"
                          >
                            * I'm the author of this icon
                          </coral-checkbox>
                        </div>

                      </form>
                    </div>
                  </div>
                  
                  <!-- Drag to upload -->
                  <div
                  class="m-auto fileupload-wrapper"
                    coral-fileupload-select=""
                  >
                    <div class="fileUpload-dropZone drop-zone">
                      <div class="h-full">
                        <div class="drop-zone-wrapper">
                          <coral-icon class="m-auto" :icon="coralIcons.addIcon" size="XL" alt="Larger" title="XL"></coral-icon>
                          <span class="m-auto"> 
                            Add/drop files
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </coral-fileupload>
        
      </div>
    </coral-dialog-content>
    
    <coral-dialog-footer>
      <button is="coral-button" coral-close="">
        Cancel
      </button>

      <button 
        is="coral-button" 
        variant="cta" 
        :disabled="!validateForm" 
        @click="onUpload"
      >
        Upload
      </button>
    </coral-dialog-footer>

  </coral-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js'

import deleteIcon from "../assets/icons/delete.svg"
import addCoralIcon from "../assets/icons/add.svg"
import iconTemplate from "../assets/icons/icon_template.png"
import iconBrew from "../api/iconBrew.js"

// Components
const SubmissionIconPreview = defineAsyncComponent(() => import('@/components/SubmissionIconPreview.vue'))

// Store
const store = useStore()

// Getters
const getAppCategories = computed(() => store.getters.getAppCategories)
const getIconType = computed(() => store.getters.getIconType)

// Actions
const showToast = (payload) => store.dispatch('showToast', payload)
const fetchAppCategories = () => store.dispatch('fetchAppCategories')
const fetchIconType = () => store.dispatch('fetchIconType')

// Reactive state
const imageData = ref(false)
const validUpload = ref(false)
const filesToShow = reactive({})
const filesToUpload = reactive({})
const coralIcons = reactive({
  addIcon: addCoralIcon,
  deleteIcon: deleteIcon,
})
const isCheckingSize = ref(false)
const uploadProgress = ref(0)
const totalNumFiles = ref(0)
const email = ref("")
const credit = ref("")
const appName = ref("")
const yourName = ref("")
const isLoading = ref(false)
const categoriesList = ref([])

// Methods
function openFileUpload(uploadId, iconId) {
  event.preventDefault()
  const uploadInput = document.getElementById(uploadId)
  let iconFile = filesToShow[iconId].icnsFile

  if (iconFile) {
    filesToShow[iconId].icnsFile = ''
    uploadInput.value = ''
  } else {
    uploadInput.click()
  }
}

function iconBrewFn(icon, size) {
  console.log(iconBrew[icon + size])
  return iconBrew[icon + size]
}

function checkSize(id) {
  isCheckingSize.value = !isCheckingSize.value
  document.getElementById(id).classList.toggle("check-size")
}

function getCheckedValue(e, appNameParam, field) {
  let fieldValue = e.target.checked
  filesToShow[appNameParam][field] = fieldValue
}

function getValue(e, appNameParam, field) {
  console.log(e)
  let target = e.target
  let fieldValue = target.value
  filesToShow[appNameParam][field] = fieldValue
}

function selectedOption(option, value) {
  return option == value || null
}

function removeFile(e, randId) {
  delete filesToUpload[randId]
  delete filesToShow[randId]

  // If imageURL is empty, show the upload files component
  if (Object.keys(filesToShow).length === 0) {
    imageData.value = false
  }
}

function setIcns(event, iconId) {
  let file = event.target.files[0]
  filesToShow[iconId].icnsFile = file
  console.log("event: ", filesToShow[iconId])
}

function selectIcon(event) {
  // Get selected image
  let files = event.target.uploadQueue

  // Only run if what has triggered the change is the upload wrapper
  if (!event.target.classList.contains("fileupload-wrapper")) {
    return
  } else {
    // Go through all the files that have been selected
    for (let fileNum in files) {
      let file = files[fileNum].file
      const objectURL = window.URL.createObjectURL(file)

      // Set image to new Image to get width and height
      var img = new Image()
      img.onload = function() {
        let width = this.width
        let height = this.height
        if (width, height != 1024) {
          window.URL.revokeObjectURL(this.src)
          showToast({
            id: "toastMessage",
            message: "Icon needs to be 1024px, yours is " + height + "px x " + width + "px",
            variant: "error"
          })
        } else {
          let fileName = file.name.replace('.png', '')
          let randId = Math.floor(Math.random() * 10000000 + 1) + "-" + fileName + Object.keys(filesToShow).length
          filesToUpload[randId] = file

          let value = {
            img: objectURL,
            name: fileName,
            file: file,
            isDarkMode: false,
            isLiquidGlass: false,
            category: "",
            appWebsite: "",
            type: "Zz9QX1BBIZ",
            randId: randId,
          }

          imageData.value = true
          filesToShow[randId] = value
        }
      }
      // Create URL of file to display back the image
      img.src = objectURL
    }

    totalNumFiles.value = Object.keys(filesToShow).length
    event.target.clear()
  }
}

// Helper function to convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

async function onUpload() {
  // Get today's date for analytics
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const dateStr = dd + '/' + mm + '/' + yyyy

  window.plausible("IconSubmission", { props: { date: dateStr } })

  isLoading.value = true
  const dialog = document.getElementById('submissionDialog')
  const sessionToken = Parse.User.current()?.getSessionToken()

  if (!sessionToken) {
    showToast({
      id: "toastMessage",
      message: "You must be logged in to upload icons",
      variant: "error"
    })
    isLoading.value = false
    return
  }

  const fileKeys = Object.keys(filesToShow)

  for (const fileNum of fileKeys) {
    const iconData = filesToShow[fileNum]
    const randId = iconData.randId

    try {
      // Convert PNG file to base64
      const pngFileBase64 = await fileToBase64(iconData.file)

      // Convert ICNS file to base64 if present
      let icnsFileBase64 = null
      let icnsFileName = null
      if (iconData.icnsFile) {
        icnsFileBase64 = await fileToBase64(iconData.icnsFile)
        icnsFileName = iconData.icnsFile.name
      }

      // Prepare request payload
      const payload = {
        appName: iconData.name,
        categoryId: iconData.category,
        typeId: iconData.type,
        pngFileBase64,
        pngFileName: iconData.file.name,
        icnsFileBase64,
        icnsFileName,
        isDarkMode: iconData.isDarkMode,
        isLiquidGlass: iconData.isLiquidGlass,
        isAuthor: iconData.isAuthor
      }

      console.log("payload: ", payload)
      console.log("import.meta.env.VITE_BACKEND_URL + 'v1/icons/submit': ", import.meta.env.VITE_BACKEND_URL + 'v1/icons/submit')
      
      
      // Call backend endpoint
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/icons/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-parse-session-token': sessionToken
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log("result: ", result)

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload icon')
      }

      console.log("Success: ", result)

      imageData.value = {}
      uploadProgress.value++

      delete filesToShow[randId]
      delete filesToUpload[randId]

    } catch (error) {
      console.log("error: ", error)
      isLoading.value = false
      showToast({
        id: "toastMessage",
        message: error.message || "There was an error uploading the icon",
        variant: "error"
      })
      return
    }
  }

  // All uploads completed successfully
  isLoading.value = false
  imageData.value = false
  uploadProgress.value = 0

  showToast({
    id: "toastMessage",
    message: "All icons have been uploaded.",
    variant: "success"
  })
  dialog.hide()
}

// Computed
const validateForm = computed(() => {
  var isValid = []

  if (imageData.value) {
    for (let item in filesToShow) {
      let isAuthor = filesToShow[item].isAuthor
      for (let field in filesToShow[item]) {
        let submission = filesToShow[item][field]
        if (submission != "" && submission != undefined && field != "appWebsite" && isAuthor) {
          isValid.push(true)
        } else if (field != "appWebsite" && field != "isDarkMode" && field != "isLiquidGlass") {
          isValid.push(false)
        }
      }
    }
  } else {
    isValid.push(false)
  }

  return !isValid.some((el) => el == false)
})

// Lifecycle
onMounted(() => {
  fetchAppCategories()
  fetchIconType()
})
</script>

<style>
</style>