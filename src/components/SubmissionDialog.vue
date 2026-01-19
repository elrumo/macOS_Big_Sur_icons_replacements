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
                                :selected="icon.category.includes(category.id)"
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
                          <span class="m-auto"> Add/drop files </span>
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

      <button is="coral-button" variant="cta" :disabled="!validateForm" @click="onUpload">
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
  return option == value
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

async function onUpload() {
  let DownloadCount = Parse.Object.extend("DownloadCount")
  let IconType = Parse.Object.extend("IconType")
  let Categories = Parse.Object.extend("Categories")
  let typQuery = new Parse.Query(IconType)
  let categoryQuery = new Parse.Query(Categories)

  // Get today's date
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()

  today = dd + '/' + mm + '/' + yyyy

  window.plausible("IconSubmission", { props: { date: today } })

  isLoading.value = true
  let dialog = document.getElementById('submissionDialog')

  for (let fileNum in filesToShow) {
    let file = filesToShow[fileNum].file
    let appNameVal = filesToShow[fileNum].name
    let randId = filesToShow[fileNum].randId
    let typeId = filesToShow[fileNum].type
    let isDarkMode = filesToShow[fileNum].isDarkMode
    let isLiquidGlass = filesToShow[fileNum].isLiquidGlass
    let isAuthor = filesToShow[fileNum].isAuthor
    let icnsFile = filesToShow[fileNum].icnsFile ? filesToShow[fileNum].icnsFile : ''
    let icnsFileUrl = ''
    let parseIcnsFile

    // Retrieve Category Parse object
    let category = filesToShow[fileNum].category
    categoryQuery.get(category)
    category = await categoryQuery.find()
    category = category[0]

    var type
    // Retrieve IconType Parse object
    for (let item in getIconType.value) {
      if (getIconType.value[item].id == typeId) {
        type = getIconType.value[item].parseObj
      }
    }

    let fileName

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(appNameVal)) {
      fileName = appNameVal
    } else {
      let d = new Date()
      fileName = Math.round(Math.random() * 10000 + d.getTime())
      fileName = fileName.toString()
    }

    const Icons = Parse.Object.extend("Icons2")
    const icons = new Icons()

    console.log("icnsFile: ", icnsFile)
    if (icnsFile != '') {
      parseIcnsFile = new Parse.File(fileName + '.icns', icnsFile)
      let saveIcns = await parseIcnsFile.save()
      icnsFileUrl = saveIcns._url
    }

    const parseFile = new Parse.File(fileName, file)
    parseFile.save().then((uploaded) => {
      console.log("Success: ", uploaded._url)
      let iconUrl = uploaded._url.replace('http:', "https:")
      let currentUser = Parse.User.current()

      let dataToStore = {
        appName: appNameVal,
        fileName: fileName,
        highResPngFile: parseFile,
        highResPngUrl: iconUrl,
        timeStamp: Date.now(),
        approved: false,
        user: currentUser,
        email: Parse.User.current().getEmail(),
        usersName: Parse.User.current().getUsername(),
        credit: Parse.User.current().get("credit"),
        category: category,
        type: type,
        DownloadCount: new DownloadCount(),
        isDarkMode: isDarkMode,
        isLiquidGlass: isLiquidGlass,
        isAuthor: isAuthor
      }

      if (parseIcnsFile != '') {
        dataToStore.icnsFile = parseIcnsFile
        dataToStore.icnsUrl = icnsFileUrl
      }

      icons.set(dataToStore)

      const acl = new Parse.ACL()
      acl.setPublicReadAccess(true)
      acl.setWriteAccess(Parse.User.current().id, true)
      acl.setRoleWriteAccess("Admin", true)

      icons.setACL(acl)
      icons.save().then((icon) => {
        // Add icon relationship to user
        let userRelation = currentUser.relation("icons")
        userRelation.add(icons)
        currentUser.save().then().catch((error) => {
          console.log("error: ", error)
        })

        imageData.value = {}
        uploadProgress.value++

        delete filesToShow[randId]
        delete filesToUpload[randId]

        if (Object.keys(filesToUpload).length === 0) {
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
      }, (error) => {
        console.log("Data NOT saved: ", error)
      })
    }, function(error) {
      console.log("error: ", error)
      isLoading.value = false
      showToast({
        id: "toastMessage",
        message: "There was an error, get in touch with @elrumo on Twitter",
        variant: "error"
      })
    })
  }
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