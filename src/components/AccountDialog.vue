<template>
  <div>
    <UModal v-model:open="isOpen" v-if="getUser.isAuth" :ui="{ width: 'max-w-lg' }">
      <!-- Reset Password Nested Modal -->
      <UModal v-model:open="showResetPassword" :ui="{ width: 'max-w-sm' }">
        <template #header>
          <h3 class="text-lg font-semibold">Reset your password</h3>
        </template>
        <div class="p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            You will receive an email to reset your password.
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Make sure to check your spam folder if you don't receive it within the next few minutes.
          </p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showResetPassword = false">Cancel</UButton>
            <UButton @click="resetPassword">Reset password</UButton>
          </div>
        </template>
      </UModal>

      <template #header>
        <h3 class="text-lg font-semibold">Settings</h3>
      </template>

      <div class="p-4 relative">
        <!-- Loading Overlay -->
        <div v-if="isLoading.requestUserData || isLoading.updatingUser" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
          <div class="text-center">
            <UProgress animation="carousel" class="mb-2" />
            <p class="text-sm">{{ isLoading.updatingUser ? 'Saving changes...' : 'Fetching your data' }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Your Profile Section -->
          <div>
            <h3 class="text-sm font-semibold mb-4">Your Profile</h3>

            <!-- Profile Photo -->
            <div class="flex items-center gap-4 mb-4">
              <img class="w-16 h-16 rounded-full object-cover" :src="getUserProfilePic()" alt="Profile">
              <label class="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="uploadProfilePhoto"
                >
                <UButton variant="soft" size="sm">
                  <UIcon name="i-heroicons-cloud-arrow-up" class="w-4 h-4 mr-1" />
                  Upload
                </UButton>
              </label>
            </div>

            <!-- Username -->
            <UFormField label="Your username" class="mb-3">
              <UInput
                v-model="formData.username"
                :placeholder="getUser.userData.username"
                @input="onFieldChange('username')"
                class="w-full"
              />
            </UFormField>

            <!-- Name to Show -->
            <UFormField label="Your name" class="mb-3">
              <UInput
                v-model="formData.nameToShow"
                :placeholder="getUser.userData.nameToShow"
                @input="onFieldChange('nameToShow')"
                class="w-full"
              />
            </UFormField>

            <!-- Bio -->
            <UFormField label="Bio" class="mb-3">
              <UTextarea
                v-model="formData.bio"
                :placeholder="getUser.userData.bio"
                :maxlength="160"
                @input="onFieldChange('bio')"
                class="w-full"
                :rows="3"
              />
              <template #hint>
                <span class="text-xs text-gray-500">{{ (formData.bio || '').length }} / 160</span>
              </template>
            </UFormField>

            <!-- Twitter Handle -->
            <UFormField label="Twitter Handle" class="mb-3">
              <UInput
                v-model="formData.twitterHandle"
                placeholder="username"
                @input="onFieldChange('twitterHandle')"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500">@</span>
                </template>
              </UInput>
            </UFormField>
          </div>

          <!-- Account Settings Section -->
          <div>
            <h3 class="text-sm font-semibold mb-4">Account settings</h3>

            <!-- Email (readonly) -->
            <UFormField label="Your email" class="mb-3">
              <UInput
                :model-value="getUser.userData.email"
                readonly
                class="w-full bg-gray-50 dark:bg-gray-800"
              />
            </UFormField>

            <!-- Password (readonly) -->
            <UFormField label="Password" class="mb-3">
              <UInput
                model-value="*******"
                type="password"
                readonly
                class="w-full bg-gray-50 dark:bg-gray-800"
              />
              <template #hint>
                <p class="text-xs text-gray-500 mt-1">
                  Problems signing in?
                  <a @click="resetPassword" class="text-primary cursor-pointer">Reset password</a>
                </p>
              </template>
            </UFormField>

            <!-- Credit URL -->
            <UFormField label="This is how you'll be credited" class="mb-3">
              <UInput
                v-model="formData.credit"
                :placeholder="getUser.userData.credit"
                @input="onFieldChange('credit')"
                class="w-full"
              />
            </UFormField>

            <!-- Switches -->
            <div class="space-y-3 mt-4">
              <USwitch
                v-model="formData.usaDateFormat"
                label="Use USA date format"
                @update:model-value="onFieldChange('usaDateFormat')"
              />

              <USwitch
                v-model="formData.isSubscribed"
                label="Subscribe to newsletter"
                @update:model-value="onFieldChange('isSubscribed')"
              />
            </div>

            <p class="text-xs text-gray-500 mt-4">
              <a @click="requestUserData" class="text-primary cursor-pointer">Request</a>
              all the data macOSicons has about me.
            </p>

            <!-- Danger Zone -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h4 class="text-sm font-semibold text-red-600 mb-2">Danger Zone</h4>
              <p class="text-xs text-gray-500 mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <UButton color="red" variant="soft" @click="showDeleteAccountDialog">
                Delete Account
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton
            :disabled="!hasChanged || !isValidated"
            @click="updateUserProp"
          >
            Save
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Account Dialog -->
    <DeleteAccountDialog ref="deleteAccountDialogRef" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse';

import DeleteAccountDialog from './DeleteAccountDialog.vue'
import profilePic from "../assets/Resources/accounts/profilePic.png"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const isOpen = ref(false)
const showResetPassword = ref(false)
const deleteAccountDialogRef = ref(null)

const isLoading = reactive({
  requestUserData: false,
  updatingUser: false
})

const isValidated = ref(true)
const hasChanged = ref(false)
const isReset = ref(false)

const formData = reactive({
  username: '',
  nameToShow: '',
  bio: '',
  twitterHandle: '',
  credit: '',
  usaDateFormat: false,
  isSubscribed: false
})

const toUpdate = reactive({})

// Computed
const getUser = computed(() => store.getters.getUser)

// Watch
watch(() => props.modelValue, (val) => {
  isOpen.value = val
  if (val) {
    initFormData()
  }
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Initialize form data from user
function initFormData() {
  const userData = getUser.value.userData || {}
  formData.username = userData.username || ''
  formData.nameToShow = userData.nameToShow || ''
  formData.bio = userData.bio || ''
  formData.twitterHandle = userData.twitterHandle || ''
  formData.credit = userData.credit || ''
  formData.usaDateFormat = userData.usaDateFormat || false
  formData.isSubscribed = userData.isSubscribed || false
  hasChanged.value = false
}

// Expose method to open dialog
const open = () => {
  isOpen.value = true
  initFormData()
}

defineExpose({ open })

// Methods
function showToast(payload) {
  store.dispatch('showToast', payload)
}

function setData(payload) {
  store.dispatch('setData', payload)
}

function fetchUserAttributes() {
  store.dispatch('fetchUserAttributes')
}

function getUserProfilePic() {
  const user = Parse.User.current()
  if (user) {
    const photo = user.get("profilePhoto")
    return photo ? photo.url() : profilePic
  }
  return profilePic
}

async function uploadProfilePhoto(event) {
  try {
    const file = event.target.files[0]
    if (!file) return

    const parseFile = new Parse.File(file.name, file)
    await parseFile.save()

    const user = Parse.User.current()
    user.set('profilePhoto', parseFile)
    await user.save()

    showToast({
      id: "toastMessage",
      message: "Profile photo uploaded successfully.",
      variant: "success"
    })
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    showToast({
      id: "toastMessage",
      message: "Error uploading profile photo.",
      variant: "error"
    })
  }
}

async function resetPassword() {
  const email = Parse.User.current()?.get("email")

  if (isReset.value) {
    isReset.value = false
    showResetPassword.value = false

    Parse.User.requestPasswordReset(email).then(() => {
      showToast({
        id: "toastMessage",
        message: "Check your email",
        variant: "success"
      })
    })
  } else {
    isReset.value = true
    showResetPassword.value = true
  }
}

async function requestUserData() {
  isLoading.requestUserData = true
  const user = Parse.User.current()
  await user.fetch()

  function downloadFile(fileUrl, fileName) {
    const a = document.createElement("a")
    a.href = fileUrl
    a.setAttribute("download", fileName)
    a.click()
    a.remove()
  }

  let fileURL
  if (user.get("userInfoFile")) {
    fileURL = user.get("userInfoFile").url()
  } else {
    fileURL = await Parse.Cloud.run("requestUserData", { id: user.id })
  }

  downloadFile(fileURL, user.get('username') + "_" + user.id + ".json")
  isLoading.requestUserData = false
  showToast({
    id: "toastMessage",
    message: "Data downloaded successfully.",
    variant: "success"
  })
}

function onFieldChange(field) {
  hasChanged.value = true
  isValidated.value = true

  let value = formData[field]

  // Process username
  if (field === 'username' && value) {
    value = value.replaceAll(" ", '_').replaceAll("/", '_').replaceAll("#", '_').toLowerCase()
    formData[field] = value
  }

  toUpdate[field] = value
}

async function updateUserProp() {
  isLoading.updatingUser = true
  const ParseUser = Parse.User.current()

  for (const key in toUpdate) {
    ParseUser.set(key, toUpdate[key])
    setData({ state: 'user', key: key, data: toUpdate[key] })
  }

  try {
    await ParseUser.save()
    fetchUserAttributes()
    isLoading.updatingUser = false
    isOpen.value = false
    showToast({
      id: "toastMessage",
      message: "Updated settings successfully.",
      variant: "success"
    })
    hasChanged.value = false
  } catch (error) {
    console.error(error)
    isLoading.updatingUser = false
    showToast({
      id: "toastMessage",
      message: "Error updating settings.",
      variant: "error"
    })
  }
}

function showDeleteAccountDialog() {
  if (deleteAccountDialogRef.value) {
    deleteAccountDialogRef.value.open()
  }
}

onMounted(() => {
  if (getUser.value.isAuth) {
    initFormData()
  }
})
</script>
