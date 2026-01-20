<template>
  <div>
    <!-- Edit user dialog -->
    <UModal v-model:open="editUserDialogOpen" :ui="{ width: 'max-w-md' }">
      <template #header>
        <h3 class="text-lg font-semibold">{{ selectedUser.usersName }}</h3>
      </template>

      <div class="p-4 space-y-4">
        <UFormField label="usersName">
          <UInput
            v-model="editUserName"
            @blur="editDoc(selectedUser, { target: { value: editUserName } }, 'usersName', true)"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Credit">
          <UInput
            v-model="editUserCredit"
            @blur="editDoc(selectedUser, { target: { value: editUserCredit } }, 'credit', true)"
            class="w-full"
          />
        </UFormField>

        <UFormField label="email">
          <UInput
            v-model="editUserEmail"
            @blur="editDoc(selectedUser, { target: { value: editUserEmail } }, 'email', true)"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="editUserDialogOpen = false">Done</UButton>
        </div>
      </template>
    </UModal>

    <!-- Sign in well -->
    <div v-if="!isAuth" class="max-w-md mx-auto mt-12 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div class="space-y-4">
        <UFormField label="Email">
          <UInput
            v-model="loginEmail"
            type="email"
            placeholder="Email"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Password">
          <UInput
            v-model="loginPassword"
            type="password"
            placeholder="Password"
            class="w-full"
          />
        </UFormField>
        <UAlert
          v-if="errorSinginIn"
          color="red"
          variant="soft"
          :title="errorMessage"
        />
        <UButton color="primary" block @click="signIn" class="mt-4">Sign In</UButton>
      </div>
    </div>

    <h3 v-if="isObjEmpty(icons) && isAuth" class="text-xl font-semibold text-center mt-12">
      No icons to approve
    </h3>

    <section class="dashBoard">
      <!-- Tabs -->
      <div v-if="isAuth && isAdmin" class="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="changeIconStatus('newIcons')"
          :class="[
            'pb-2 px-1 font-medium text-sm border-b-2 transition-colors',
            iconsToShow === 'newIcons'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          New Icons
          <span class="opacity-80 ml-1">({{ iconListLen }})</span>
        </button>
        <button
          @click="changeIconStatus('reUploaded')"
          :class="[
            'pb-2 px-1 font-medium text-sm border-b-2 transition-colors',
            iconsToShow === 'reUploaded'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          Re-uploaded
          <span class="opacity-80 ml-1">({{ iconListLenReUpload }})</span>
        </button>
      </div>

      <div class="p-6">
        <div v-for="user in iconType" :key="user.usersName" class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <a
              :href="'mailto:' + user.email + '?subject=macOS icons submission'"
              @click="copyText(user.usersName)"
              class="text-xl font-semibold hover:underline"
            >
              {{ user.usersName }}
            </a>
            <img @click="showDialog(user)" class="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100" :src="coralIcons.edit" alt="">
            <img @click="sendEmail(user)" class="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 ml-2" :src="coralIcons.email" alt="">

            <UBadge v-if="user.emailSent === 'requested'" color="blue" size="xs">Sending</UBadge>
            <UBadge v-if="user.emailSent === 'sent'" color="green" size="xs">Sent</UBadge>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="icon in user.icons" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4" :key="icon.highResPngUrl">
              <div class="relative">
                <UBadge v-if="icon.isReupload && icon.isAuthor" color="green" size="xs" class="absolute top-0 left-0 z-10">Author</UBadge>
                <UBadge v-if="icon.isReupload && !icon.isAuthor" color="yellow" size="xs" class="absolute top-0 left-0 z-10">Reupload</UBadge>

                <div v-if="icon.isReview" class="absolute top-0 right-0 z-10">
                  <UBadge color="green" size="xs">Approved</UBadge>
                </div>

                <div v-if="!icon.isReview && icon.isReUpload" class="absolute top-0 right-0 z-10">
                  <UBadge color="yellow" size="xs">Pending</UBadge>
                </div>

                <a :href="icon.imgUrl" target="_blank" class="block">
                  <img
                    v-lazy="{
                      src: icon.highResPngFile?.url || icon.highResPngUrl,
                      loading: coralIcons.loading,
                      error: coralIcons.loading
                    }"
                    class="w-full aspect-square object-contain"
                  />
                </a>

                <UButton
                  icon="i-heroicons-trash"
                  size="xs"
                  color="red"
                  variant="ghost"
                  class="absolute bottom-0 right-0"
                  @click="deleteSubmission(icon)"
                />
              </div>

              <div class="mt-3 space-y-2">
                <p class="text-xs text-gray-500">
                  {{ getDate(icon.timeStamp) }}
                </p>

                <UInput
                  :model-value="prettifyName(icon.appName)"
                  @blur="(e) => editDoc(icon, e, 'appName', false)"
                  class="w-full font-semibold"
                  size="sm"
                />

                <UInput
                  size="xs"
                  :model-value="icon.usersName"
                  @blur="(e) => editDoc(icon, e, 'usersName')"
                  class="w-full text-sm"
                />

                <UInput
                  v-if="icon.credit === ''"
                  size="xs"
                  model-value="n/a"
                  @blur="(e) => editDoc(icon, e, 'credit')"
                  class="w-full text-xs opacity-50"
                />

                <div class="pt-3 space-y-2">
                  <UCheckbox
                    :model-value="icon.isLiquidGlass"
                    label="Liquid Glass"
                    @update:model-value="(val) => toggleLiquidGlass(icon, { target: { checked: val } })"
                  />

                  <div class="flex gap-2">
                    <UButton size="sm" color="primary" @click="approveIcon(icon)">Approve</UButton>
                    <UButton v-if="icon.isReview" size="sm" variant="soft" @click="unApproveIcon(icon)">Unapprove</UButton>
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
import Parse from 'parse';

const VITE_PARSE_APP_ID = import.meta.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = import.meta.env.VITE_PARSE_URL

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY)
Parse.serverURL = VITE_PARSE_URL

const Icons = Parse.Object.extend("Icons2")
Parse.User.enableUnsafeCurrentUser()

const docLimit = 800

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
const loginEmail = ref("")
const loginPassword = ref("")
const iconListLen = ref(0)
const iconListLenReUpload = ref(0)
const howManyRecords = ref(0)
const isAdmin = ref(false)
const isAuth = ref(false)
const selectedUser = ref({})
const scrolledToBottom = ref(true)
const iconsToShow = ref("newIcons")
const editUserDialogOpen = ref(false)
const editUserName = ref("")
const editUserCredit = ref("")
const editUserEmail = ref("")

const coralIcons = {
  delete: deleteIcon,
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

// Methods
function changeIconStatus(status) {
  iconsToShow.value = status
  if (status === 'reUploaded') {
    getReUploadIcons()
  }
}

async function copyText(toCopy) {
  await navigator.clipboard.writeText(toCopy)
}

function showDialog(user) {
  selectedUser.value = user
  editUserName.value = user.usersName || ""
  editUserCredit.value = user.creditUrl || ""
  editUserEmail.value = user.email || ""
  editUserDialogOpen.value = true
}

function getDate(timeStamp) {
  const newDate = new Date(timeStamp)
  let day = newDate.getUTCDate()
  if (day < 10) day = "0" + day
  let month = newDate.getUTCMonth() + 1
  if (month < 10) month = "0" + month
  const year = newDate.getFullYear()
  return day + "/" + month + "/" + year
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
        showToast({ id: "toastMessage", message: "Error updating", variant: "error" })
      })
    }
  } else {
    const IconsBase = Parse.Object.extend("Icons2")
    const query = new Parse.Query(IconsBase)
    const docToEdit = await query.get(icon.id)

    docToEdit.set({ [field]: newName })
    docToEdit.save().then(() => {
      console.log(field, "updated.")
    }).catch((e) => {
      console.log(e)
      showToast({ id: "toastMessage", message: "Error updating", variant: "error" })
    })
  }
}

async function signIn() {
  Parse.User.logIn(loginEmail.value, loginPassword.value).then((user) => {
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
  return Object.keys(obj).length === 0
}

async function deleteSubmission(icon) {
  try {
    const query = new Parse.Query(Icons)
    const docToDelete = await query.get(icon.id)
    await docToDelete.destroy()

    delete icons[icon.usersName].icons[icon.appName]
    if (Object.keys(icons[icon.usersName].icons).length === 0) {
      delete icons[icon.usersName]
    }
  } catch (error) {
    console.error(error)
  }
}

function prettifyName(name) {
  return name?.replaceAll("_", " ") || ""
}

async function approveIcon(icon) {
  const newIcon = { ...icon }
  delete newIcon.DownloadCount
  delete newIcon.user
  delete newIcon.category
  delete newIcon.type

  try {
    const result = await Parse.Cloud.run("approve", newIcon)
    icon.isReview = true
    icon.isReUploadReview = true
    showToast({ id: "toastMessage", message: "Icon has been approved", variant: "success" })
  } catch (e) {
    showToast({ id: "toastMessage", message: e.message, variant: "error" })
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
    showToast({ id: "toastMessage", message: 'Icon has been unapproved', variant: "success" })
  } catch (error) {
    showToast({ id: "toastMessage", message: error, variant: "error" })
  }
}

async function toggleLiquidGlass(icon, event) {
  const isChecked = event.target.checked
  icon.isLiquidGlass = isChecked

  const IconsBase = Parse.Object.extend("Icons2")
  const query = new Parse.Query(IconsBase)
  const docToEdit = await query.get(icon.id)

  docToEdit.set("isLiquidGlass", isChecked)

  try {
    await docToEdit.save()
    showToast({
      id: "toastMessage",
      message: isChecked ? 'Icon marked as Liquid Glass' : 'Liquid Glass removed from icon',
      variant: "success"
    })
  } catch (error) {
    showToast({ id: "toastMessage", message: error.message, variant: "error" })
  }
}

async function sendEmail(icon) {
  icons[icon.usersName].emailSent = "requested"

  const payLoad = {
    email: icon.email,
    usersName: icon.usersName,
    id: icon.user?.objectId
  }

  Parse.Cloud.run("sendEmail", payLoad).then(() => {
    icons[icon.usersName].emailSent = "sent"
    showToast({ id: "toastMessage", message: "Email has been sent", variant: "success" })
  }).catch((e) => {
    showToast({ id: "toastMessage", message: e, variant: "error" })
  })
}

function getIconListLen(query) {
  query.count().then((count) => {
    iconListLen.value = count
  })
}

function getIconListLenReUpload(query) {
  query.count().then((count) => {
    iconListLenReUpload.value = count
  })
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
    let user = docData.user
    const email = docData.email
    const creditUrl = docData.credit

    if (!usersName) {
      if (!icons["Undefined"]) {
        icons["Undefined"] = { usersName: "Undefined", email, icons: {}, emailSent: false, creditUrl }
      }
      icons["Undefined"].icons[docData.id] = docData
    } else {
      if (!icons[usersName]) {
        icons[usersName] = { usersName, email, icons: {}, emailSent: false, creditUrl, user }
      }
      icons[usersName].icons[docData.id] = docData
    }
  }
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
    let user = docData.user
    const email = docData.email
    const creditUrl = docData.credit

    if (!icons.reUploaded[usersName]) {
      icons.reUploaded[usersName] = { usersName, email, icons: {}, emailSent: false, creditUrl, user }
    }
    icons.reUploaded[usersName].icons[docData.id] = docData
  }
}

// Computed
const iconType = computed(() => {
  return iconsToShow.value === "newIcons" ? icons : icons.reUploaded
})

// Lifecycle
onMounted(() => {
  const currentUser = Parse.User.current()

  if (currentUser) {
    isAdmin.value = currentUser.attributes?.isAdmin

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
  }
})
</script>

<style scoped>
.dashBoard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
