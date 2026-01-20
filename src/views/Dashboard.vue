<template>
  <div>
    <coral-toast id="toastMessage" variant="success">
      All icons have been updated
    </coral-toast>

    <coral-toast id="error" variant="error">
      There has been an error, please try again.
    </coral-toast>

    <!-- Sign in well -->
    <div v-if="!isAuth" id="signIn-wrapper" class="coral-Well m-t-48">
      <div class="m-b-24">
        <input id="email" type="email" placeholder="Email" is="coral-textfield" aria-label="text input">
      </div>
      <div class="m-b-24">
        <input id="password" type="password" placeholder="Password" is="coral-textfield"  aria-label="text input">
      </div>
      <div style="color: #E97273" v-if="errorSinginIn">
        {{ errorMessage }}
      </div>
      <div id="signin-button" class="m-t-48 m-b-4">
        <button is="coral-button" variant="cta" @click="signIn">Sign In</button>
      </div>
    </div>
    

    <h3 id="noIcons" class="coral-Heading--M m-t-48" v-if="isObjEmpty(icons) & isAuth">
      No icons to aprove
    </h3>

  <!-- Edit user dialog -->
    <coral-dialog id="editUserDialog">
      <coral-dialog-header>{{ selectedUser.usersName }}</coral-dialog-header>
      
      <coral-dialog-content>  
        <form class="coral-Form coral-Form--vertical" style="max-width:300px;">
          <label id="nameEditUser" class="coral-FieldLabel">usersName</label>
          <input id="nameEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'usersName', true)" :value="selectedUser.usersName" labelledby="nameEditUser" class="coral-Form-field">

          <label id="creditEditUser" class="coral-FieldLabel">Credit</label>
          <input id="creditEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'credit', true)" :value="selectedUser.creditUrl" labelledby="creditEditUser" class="coral-Form-field">

          <label id="emailEditUser" class="coral-FieldLabel">email</label>
          <input id="emailEditUserInput" is="coral-textfield" @change="editDoc(selectedUser, $event, 'email', true)" :value="selectedUser.email" labelledby="emailEditUser" class="coral-Form-field">
        </form>
      </coral-dialog-content>

      <coral-dialog-footer>
        <button is="coral-button" variant="primary" coral-close="">Done</button>
      </coral-dialog-footer>
    </coral-dialog>

    <section class="dashBoard">
      
      <!-- Search Bar -->
      <!-- <div v-if="isAuth" @click="isSearch = true" class="main-search-wrapper coral-bg p-b-16">
        <div class="m-auto main-search">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'(Not working yet) - Icons to approve: ' + iconListLen" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark searchBar-left" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>
      </div> -->
      
      <!-- Tabs -->
      <coral-tablist v-if="isAuth && isAdmin">
        <coral-tab aria-label="newIcons" selected="" @click="changeIconStatus('newIcons')">
          New Icons
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ( {{iconListLen}} )
          </span>
        </coral-tab>
        
        <coral-tab aria-label="Approved Icons" @click="changeIconStatus('reUploaded')">
          Re-uploaded
          <span class="coral-Detail coral-Detail--M f-w-400 opacity-80">
            ( {{iconListLenReUpload}} )
          </span>
        </coral-tab>
      </coral-tablist>

      <div
        class="p-t-24 p-b-40 dashboard-wrapper"
      >
        <!-- v-if="iconsToShow == 'newIcons'" -->
        <div v-for="user in iconType" :key="user.usersName" class="p-b-32">
          
          <h3 class="coral-Heading--M p-b-8 text-left d-flex">
            <a
              :href="'mailto:'+user.email+'?subject=macOS icons submission'"
              @click="copyText(user.usersName)"
            >
              {{ user.usersName }}
            </a>
            <img @click="showDialog('editUserDialog', user)" class="dashboard-edit-user" :src="coralIcons.edit" alt="">
            <img @click="sendEmail(user)" class="dashboard-edit-user p-l-16" :src="coralIcons.email" alt="">
            
            <coral-status  v-if="user.emailSent == 'requested'" variant="info"></coral-status>
            <coral-status  v-if="user.emailSent == 'sent'" variant="success"></coral-status>

          </h3>

          <div class="icon-list-area">
            <div v-for="icon in user.icons" class="card-wrapper coral-card" :key="icon.highResPngUrl">
              <coral-status v-if="icon.isReupload && icon.isAuthor" variant="success"></coral-status>
              <coral-status v-if="icon.isReupload && !icon.isAuthor" variant="warning"></coral-status>

              <!-- {{ icon.id }} -->
              <div class="card-img-wrapper" style="max-width: 120px;">

                <div v-if="icon.isReview || icon.isReview && icon.isReUpload" class="loading-approval-wrapper">
                  <coral-status v-if="icon.isReview" variant="success"></coral-status>
                </div>

                <div v-if="!icon.isReview && icon.isReUpload" class="loading-approval-wrapper">
                  <coral-status v-if="icon.isReUpload" color="Yellow"></coral-status>
                </div>
                
                <a :href="icon.imgUrl" target="_blank">
                  <!-- src: icon.imgUrl.replace('/media/', '/parse/'), -->
                  <img
                    v-lazy="{
                        src: icon.highResPngFile.url,
                        loading:  coralIcons.loading,
                        error:  coralIcons.loading,
                        lifecycle:  coralIcons.loading
                    }" 
                  />
                </a>


                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="deleteSubmission(icon)" class="quick-action-icon" :id="icon.fileName" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>

              </div>

              <div class="card-text-wrapper p-l-16 p-r-16 p-b-0">                
                
                <!-- Date Submited -->                
                <p class="coral-Body--XS opacity-60 m-b-0">
                  <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                </p>
                  
                <!-- App name -->
                <h3 class="coral-font-color m-b-0 m-t-0">
                  <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName', false)" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                </h3>

                <!-- User's name -->
                <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                
                <!-- Credit URL -->
                <!-- v-if="icon.credit !='' "  -->
                <!-- <p
                  v-if="icon.credit !='' " 
                  class="coral-Body--XS p-b-0 opacity-50 m-b-0"
                >
                  <input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input">
                </p> -->
                
                <p v-if="icon.credit =='' " class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="'n/a'" is="coral-textfield" aria-label="text input"></p>

                <div class="p-t-16 p-b-16">
                  <coral-checkbox
                    :id="'isLiquidGlassAdmin'+icon.id"
                    :checked="icon.isLiquidGlass"
                    @change="toggleLiquidGlass(icon, $event)"
                    class="m-b-8"
                  >
                    Liquid Glass
                  </coral-checkbox>
                  
                  <div>
                    <button @click="approveIcon(icon)" class="coral-btn coral-btn-primary">Approve</button>
                    <button v-if="icon.isReview" @click="unApproveIcon(icon)" class="coral-btn coral-btn-primary m-l-8 ">Unapprove</button>
                  </div>
                </div>
                
              </div>

            </div>
          </div>
          

        </div>
      </div>

    </section>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Parse from 'parse/dist/parse.min.js'

const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = import.meta.env.VITE_PARSE_URL

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = VITE_PARSE_URL

const Icons = Parse.Object.extend("Icons2")

Parse.User.enableUnsafeCurrentUser()

const docLimit = 800

import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import deleteIcon from "../assets/icons/delete.svg"
import emailIcon from "../assets/icons/email.svg"

const store = useStore()
const router = useRouter()

// State
const icons = reactive({ reUploaded: {} })
const errorSinginIn = ref(false)
const errorMessage = ref("")
const isSearch = ref(false)
const searchString = ref("")
const iconListLen = ref(0)
const iconListLenReUpload = ref(0)
const howManyRecords = ref(0)
const sortBy = ref("usersName")
const isAdmin = ref(false)
const isAuth = ref(false)
const selectedUser = ref({})
const scrolledToBottom = ref(true)
const iconsToShow = ref("newIcons")
const currentUserRef = ref(null)

const coralIcons = {
  delete: deleteIcon,
  addIcon: addCoralIcon,
  newItem: newItemCoralIcon,
  edit: editCoralIcon,
  loading: placeholderCoralIcon,
  email: emailIcon,
}

// Store actions
function showToast(payload) {
  store.dispatch('showToast', payload)
}

function setUser(user) {
  store.dispatch('setUser', user)
}

// Store getters
const getUser = computed(() => store.getters.getUser)
const allIcons = computed(() => store.getters.allIcons)
const approvedIcons = computed(() => store.getters.approvedIcons)

// Methods
function changeIconStatus(status) {
  iconsToShow.value = status
  if (status == 'reUploaded') {
    console.log('reUploaded')
    getReUploadIcons()
  }
}

async function copyText(toCopy) {
  await navigator.clipboard.writeText("https://macosicons.com/" + toCopy)
  await navigator.clipboard.writeText(toCopy)
}

function uploadFile() {
  const fileUploadControl = document.getElementById("profilePhotoFileUpload")

  if (fileUploadControl.files.length > 0) {
    const file = fileUploadControl.files[0]
    console.log(file)
    const name = file.name
    console.log(name)

    const parseFile = new Parse.File(name, file)

    parseFile.save().then((uploaded) => {
      console.log("Success: ", uploaded)
    }, function (error) {
      console.log(error)
    })
  }
}

function showDialog(dialogId, user) {
  const nameEditUserInput = document.getElementById("nameEditUserInput")
  const creditEditUserInput = document.getElementById("creditEditUserInput")
  const emailEditUserInput = document.getElementById("emailEditUserInput")

  nameEditUserInput.value = user.usersName
  creditEditUserInput.value = user.creditUrl
  emailEditUserInput.value = user.email

  document.getElementById(dialogId).show()
  selectedUser.value = user

  console.log(user)
}

function getDate(timeStamp) {
  const newDate = new Date(timeStamp)

  let day = newDate.getUTCDate()
  if (day < 10) {
    day = "0" + day
  }
  let month = newDate.getUTCMonth() + 1
  if (month < 10) {
    month = "0" + month
  }
  const year = newDate.getFullYear()
  const date = day + "/" + month + "/" + year

  return date
}

async function editDoc(icon, e, field, isMultipleIcons) {
  const newName = e.target.value

  if (isMultipleIcons) {
    for (let doc in icon.icons) {
      const IconsBase = Parse.Object.extend("Icons2")
      const query = new Parse.Query(IconsBase)
      const docToEdit = await query.get(icon.icons[doc].id)

      docToEdit.set({ [field]: newName })
      docToEdit.save().then(() => {
        console.log(field, "updated.")
      }).catch((e) => {
        console.log(e)
        document.getElementById("error").show()
      })
    }
  } else if (!isMultipleIcons) {
    const IconsBase = Parse.Object.extend("Icons2")
    const query = new Parse.Query(IconsBase)
    const docToEdit = await query.get(icon.id)

    docToEdit.set({ [field]: newName })
    docToEdit.save().then(() => {
      console.log(field, "updated.")
    }).catch((e) => {
      console.log(e)
      document.getElementById("error").show()
    })
  }
}

async function signIn() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  console.log(email)

  const user = new Parse.User()
  user.set({
    username: email,
    password: password,
    email: email
  })

  console.log(user)
  Parse.User.logIn(email, password).then((user) => {
    isAuth.value = true
    setUser(user)
    getParseData()
    getReUploadIcons()
    errorMessage.value = ""
  }).catch((error) => {
    errorSinginIn.value = true
    errorMessage.value = error.message
    console.log(error)
  })
}

function isObjEmpty(obj) {
  return Object.keys(obj).length == 0
}

async function deleteSubmission(icon) {
  console.log(icon)
  try {
    const query = new Parse.Query(Icons)
    const docToDelete = await query.get(icon.id)
    await docToDelete.destroy()

    delete icons[icon.usersName].icons[icon.appName]
    if (Object.keys(icons[icon.usersName].icons).length == 0) {
      delete icons[icon.usersName]
    }
  } catch (error) {
    // Handle error silently
  }
}

function prettifyName(name) {
  name = name.replaceAll("_", " ")
  return name
}

async function approveIcon(icon) {
  console.log("icon.id: ", icon.id)

  const newIcon = { ...icon }
  delete newIcon.DownloadCount
  delete newIcon.user
  delete newIcon.category
  delete newIcon.type

  try {
    console.log("icon: ", icon)

    const result = await Parse.Cloud.run("approve", newIcon)
    console.log("result: ", result)
    icon.isReview = true
    icon.isReUploadReview = true
    showToast({
      id: "toastMessage",
      message: "Icon has been approved",
      variant: "success"
    })
  } catch (e) {
    console.log("e: ", e)
    showToast({
      id: "toastMessage",
      message: e.message,
      variant: "error"
    })
  }
}

async function unApproveIcon(icon) {
  icon.isReview = false
  icon.isReUploadReview = false

  const IconsBase = Parse.Object.extend("Icons2")
  const query = new Parse.Query(IconsBase)
  const docToEdit = await query.get(icon.id)

  docToEdit.set({ "approved": false })

  try {
    await docToEdit.save()
    showToast({
      id: "toastMessage",
      message: 'Icon has been unapproved',
      variant: "success"
    })
  } catch (error) {
    showToast({
      id: "toastMessage",
      message: error,
      variant: "error"
    })
  }
}

async function toggleLiquidGlass(icon, event) {
  const isChecked = event.target.checked
  icon.isLiquidGlass = isChecked

  const IconsBase = Parse.Object.extend("Icons2")
  const query = new Parse.Query(IconsBase)
  const docToEdit = await query.get(icon.id)

  console.log('icon.id: ', icon.id)
  console.log('docToEdit: ', docToEdit)

  docToEdit.set("isLiquidGlass", isChecked)

  try {
    await docToEdit.save()
    showToast({
      id: "toastMessage",
      message: isChecked ? 'Icon marked as Liquid Glass' : 'Liquid Glass removed from icon',
      variant: "success"
    })
  } catch (error) {
    console.log('error: ', error)
    showToast({
      id: "toastMessage",
      message: error.message,
      variant: "error"
    })
  }
}

async function sendEmail(icon) {
  console.log("icon: ", icon)

  icons[icon.usersName].emailSent = "requested"

  const payLoad = {
    email: icon.email,
    usersName: icon.usersName,
    id: icon.user.objectId
  }

  Parse.Cloud.run("sendEmail", payLoad).then((result) => {
    icons[icon.usersName].emailSent = "sent"
    console.log(icons[icon.usersName].emailSent)
    showToast({
      id: "toastMessage",
      message: "Email has been sent",
      variant: "success"
    })
  }).catch((e) => {
    console.log(e)
    showToast({
      id: "toastMessage",
      message: e,
      variant: "error"
    })
  })
}

function getIconListLen(query) {
  query.count().then((count) => {
    console.log(count)
    iconListLen.value = count
  })
}

function getIconListLenReUpload(query) {
  query.count().then((count) => {
    iconListLenReUpload.value = count
  })
}

async function loadMore() {
  const currentRecords = howManyRecords.value

  howManyRecords.value = currentRecords + docLimit

  const query = new Parse.Query(Icons)
  query.equalTo("approved", false)
  query.ascending(sortBy.value)
  query.exists("highResPngFile")
  query.skip(currentRecords)
  query.limit(docLimit)
  const results = await query.find()

  setTimeout(() => {
    scrolledToBottom.value = true
  }, 800)

  for (let result in results) {
    const objData = results[result].attributes

    const docData = {}
    for (let key in objData) {
      docData[key] = objData[key]
    }

    docData.imgUrl = ""

    const usersName = docData.usersName
    const email = docData.email
    const creditUrl = docData.credit
    const user = docData.user

    docData.id = results[result].id

    if (usersName == "" || usersName == undefined) {
      console.log("usersName undefined ")
      console.log("docData: ", docData)
    } else {
      if (icons[usersName] == undefined) {
        icons[usersName] = {
          "usersName": usersName,
          "email": email,
          "icons": {},
          "creditUrl": creditUrl,
          "user": user
        }
        icons[usersName].icons[docData.id] = docData
        icons[usersName].icons[docData.id].imgUrl = docData.highResPngUrl
      } else {
        icons[usersName].icons[docData.id] = docData
        icons[usersName].icons[docData.id].imgUrl = docData.highResPngUrl
      }
    }
  }
}

function scroll() {
  window.onscroll = () => {
    const bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 1600

    if (bottomOfWindow && scrolledToBottom.value && !isSearch.value) {
      scrolledToBottom.value = false
      loadMore()
    }
  }
}

function handleParseError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut()
      window.location.reload()
      break

    default:
      break
  }
}

async function getParseData() {
  const query = new Parse.Query(Icons)

  query.equalTo("approved", false)
  query.descending("createdAt")
  query.exists("highResPngFile")
  query.limit(docLimit)

  try {
    var results = await query.find()
  } catch (error) {
    console.log(error)
    handleParseError(error)
  }

  getIconListLen(query)

  howManyRecords.value = docLimit

  for (let result in results) {
    const docObj = results[result].attributes
    const docData = JSON.parse(JSON.stringify(docObj))
    docData.id = results[result].id

    docData.imgUrl = docData.highResPngUrl

    const usersName = docData.usersName
    let user

    if (docData.user) {
      user = docData.user
    }

    const email = docData.email
    const creditUrl = docData.credit

    if (usersName == "" || usersName == undefined) {
      if (icons["Undefined"] == undefined) {
        icons["Undefined"] = {
          "usersName": "Undefined",
          "email": email,
          "icons": {},
          "emailSent": false,
          "creditUrl": creditUrl
        }
        icons["Undefined"].icons[docData.appName] = docData
        icons["Undefined"].icons[docData.id].usersName = "Undefined"
        icons["Undefined"].usersName = "Undefined"
      } else {
        icons["Undefined"].icons[docData.id] = docData
        icons["Undefined"].icons[docData.id].usersName = "Undefined"
        icons["Undefined"].usersName = "Undefined"
      }
    } else {
      if (icons[usersName] == undefined) {
        icons[usersName] = {
          "usersName": usersName,
          "email": email,
          "icons": {},
          "emailSent": false,
          "creditUrl": creditUrl,
          "user": user
        }
        icons[usersName].icons[docData.id] = docData
      } else {
        icons[usersName].icons[docData.id] = docData
      }
    }
  }

  scroll()
}

async function getReUploadIcons() {
  const query = new Parse.Query(Icons)

  query.equalTo("approved", false)
  query.equalTo("isReUpload", true)
  query.descending("updatedAt")
  query.exists("highResPngFile")
  query.limit(docLimit)

  try {
    var results = await query.find()
  } catch (error) {
    console.log(error)
    handleParseError(error)
  }

  getIconListLenReUpload(query)

  howManyRecords.value = docLimit

  for (let result in results) {
    const docObj = results[result].attributes
    const docData = JSON.parse(JSON.stringify(docObj))
    docData.id = results[result].id

    docData.imgUrl = docData.highResPngUrl

    const usersName = docData.usersName
    let user

    if (docData.user) {
      user = docData.user
    }

    const email = docData.email
    const creditUrl = docData.credit

    if (icons.reUploaded[usersName] == undefined) {
      icons.reUploaded[usersName] = {
        "usersName": usersName,
        "email": email,
        "icons": {},
        "emailSent": false,
        "creditUrl": creditUrl,
        "user": user
      }
      icons.reUploaded[usersName].icons[docData.id] = docData
    } else {
      icons.reUploaded[usersName].icons[docData.id] = docData
    }
  }
}

function changeDate(icon, event) {
  // Placeholder for date change functionality
}

// Computed properties
const iconType = computed(() => {
  if (iconsToShow.value == "newIcons") {
    return icons
  } else {
    return icons.reUploaded
  }
})

const currentUser = computed(() => {
  return Parse.User.current()
})

// Lifecycle
onMounted(() => {
  currentUserRef.value = Parse.User.current()
  console.log("currentUser: ", currentUserRef.value)

  if (currentUserRef.value) {
    isAdmin.value = Parse.User.current().attributes.isAdmin
    console.log('Parse.User.current().attributes.isAdmin:', Parse.User.current().attributes.isAdmin)

    if (!isAdmin.value) {
      router.push({ path: '/#' })
      Parse.User.logOut()
      return
    }

    isAuth.value = true
    getParseData()
    getReUploadIcons()
  } else {
    isAuth.value = false
    console.log("You are not logged in")
  }
})
</script>

<style>
/* @import '/components/app.css'; */
/* @import '/components/snack-helper.min.css'; */
</style>
