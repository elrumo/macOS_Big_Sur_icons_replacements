<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'max-w-2xl' }">
    <template #header>
      <div>
        <h3 class="text-lg font-semibold">Submit an icon</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Visit the <router-link to="/resources" class="text-primary underline" @click="isOpen = false">resources page</router-link> for icon templates.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          All icons must be .png, or .icns images and have a resolution of 1024px x 1024px.
          <br>
          <strong>If you're uploading a .icns file, you must also upload a high resolution .png file.</strong>
        </p>
      </div>
    </template>

    <div class="p-4 relative min-h-[300px]">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center z-20 rounded-lg">
        <div class="text-center">
          <UProgress animation="carousel" class="mb-2" />
          <p class="text-sm">{{ uploadProgress }}/{{ totalNumFiles + 1 }} icons uploaded</p>
        </div>
      </div>

      <!-- Empty state - drop zone -->
      <label v-if="!imageData" class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <input
          type="file"
          accept="image/png"
          multiple
          class="hidden"
          @change="selectIcon"
        >
        <UIcon name="i-heroicons-plus" class="w-12 h-12 text-gray-400 mb-2" />
        <span class="text-sm text-gray-500">Add/drop files</span>
      </label>

      <!-- Files selected -->
      <div v-else class="space-y-4">
        <div v-for="icon in filesToShow" :key="icon.randId" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <UAlert
            color="blue"
            variant="soft"
            class="mb-4"
          >
            <template #title>
              <strong>Important:</strong> Please ensure your icon is the correct size (1024x1024px). App icons that are not the correct size will not be approved.
            </template>
          </UAlert>

          <div class="flex gap-4">
            <!-- Icon Preview -->
            <div class="flex-shrink-0">
              <SubmissionIconPreview
                :icon="icon"
                :removeFile="removeFile"
              />
            </div>

            <!-- Form -->
            <div class="flex-1 space-y-3">
              <UFormField label="*App name">
                <UInput
                  :model-value="icon.name"
                  @update:model-value="(val) => getValue({ target: { value: val } }, icon.randId, 'name')"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="*App category">
                <USelectMenu
                  :model-value="icon.category"
                  :items="categoryOptions"
                  placeholder="Select category (required)"
                  value-key="value"
                  @update:model-value="(val) => getValue({ target: { value: val } }, icon.randId, 'category')"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="*Type of icon">
                <USelectMenu
                  :model-value="icon.type"
                  :items="typeOptions"
                  value-key="value"
                  @update:model-value="(val) => getValue({ target: { value: val } }, icon.randId, 'type')"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="App website (optional)">
                <UInput
                  type="url"
                  placeholder="The app's developer website"
                  @update:model-value="(val) => getValue({ target: { value: val } }, icon.randId, 'appWebsite')"
                  class="w-full"
                />
              </UFormField>

              <UFormField label=".icns file (optional)">
                <UButton
                  variant="soft"
                  @click="openFileUpload('icnsFileUpload-' + icon.randId, icon.randId)"
                >
                  {{ filesToShow[icon.randId]?.icnsFile ? 'Remove .icns file' : 'Upload .icns file' }}
                </UButton>
                <input
                  type="file"
                  :id="'icnsFileUpload-' + icon.randId"
                  accept=".icns"
                  class="hidden"
                  @change="(e) => setIcns(e, icon.randId)"
                >
              </UFormField>

              <div class="space-y-2">
                <UCheckbox
                  :model-value="icon.isDarkMode"
                  label="Is dark mode"
                  @update:model-value="(val) => getCheckedValue({ target: { checked: val } }, icon.randId, 'isDarkMode')"
                />
                <UCheckbox
                  :model-value="icon.isLiquidGlass"
                  label="Liquid Glass design style"
                  @update:model-value="(val) => getCheckedValue({ target: { checked: val } }, icon.randId, 'isLiquidGlass')"
                />
                <UCheckbox
                  :model-value="icon.isAuthor"
                  label="* I'm the author of this icon"
                  @update:model-value="(val) => getCheckedValue({ target: { checked: val } }, icon.randId, 'isAuthor')"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Add more files -->
        <label class="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <input
            type="file"
            accept="image/png"
            multiple
            class="hidden"
            @change="selectIcon"
          >
          <UIcon name="i-heroicons-plus" class="w-8 h-8 text-gray-400 mr-2" />
          <span class="text-sm text-gray-500">Add more files</span>
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton
          color="primary"
          :disabled="!validateForm"
          @click="onUpload"
        >
          Upload
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js';

import SubmissionIconPreview from "../components/SubmissionIconPreview.vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const isOpen = ref(false)

const imageData = ref(false)
const filesToShow = reactive({})
const filesToUpload = reactive({})
const isCheckingSize = ref(false)
const uploadProgress = ref(0)
const totalNumFiles = ref(0)
const isLoading = ref(false)

// Store getters
const getAppCategories = computed(() => store.getters.getAppCategories)
const getIconType = computed(() => store.getters.getIconType)

// Computed options for select menus
const categoryOptions = computed(() => {
  return (getAppCategories.value || []).map(cat => ({
    label: cat.name,
    value: cat.id
  }))
})

const typeOptions = computed(() => {
  return (getIconType.value || []).map(type => ({
    label: type.name,
    value: type.id
  }))
})

// Watch for external changes
watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Expose method to open dialog
const open = () => {
  isOpen.value = true
}

defineExpose({ open })

// Store actions
function showToast(payload) {
  store.dispatch('showToast', payload)
}

function fetchAppCategories() {
  store.dispatch('fetchAppCategories')
}

function fetchIconType() {
  store.dispatch('fetchIconType')
}

// Computed
const validateForm = computed(() => {
  const isValid = []

  if (imageData.value) {
    for (let item in filesToShow) {
      const isAuthor = filesToShow[item].isAuthor
      for (let field in filesToShow[item]) {
        const submission = filesToShow[item][field]
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

// Methods
function openFileUpload(uploadId, iconId) {
  const uploadInput = document.getElementById(uploadId)
  const iconFile = filesToShow[iconId]?.icnsFile

  if (iconFile) {
    filesToShow[iconId].icnsFile = ''
    uploadInput.value = ''
  } else {
    uploadInput.click()
  }
}

function getCheckedValue(e, appNameParam, field) {
  const fieldValue = e.target.checked
  filesToShow[appNameParam][field] = fieldValue
}

function getValue(e, appNameParam, field) {
  const target = e.target
  const fieldValue = target.value
  filesToShow[appNameParam][field] = fieldValue
}

function removeFile(e, randId) {
  delete filesToUpload[randId]
  delete filesToShow[randId]

  if (Object.keys(filesToShow).length === 0) {
    imageData.value = false
  }
}

function setIcns(event, iconId) {
  const file = event.target.files[0]
  filesToShow[iconId].icnsFile = file
}

function selectIcon(event) {
  const files = event.target.files

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const objectURL = window.URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      const width = img.width
      const height = img.height
      if (width != 1024 || height != 1024) {
        window.URL.revokeObjectURL(img.src)
        showToast({
          id: "toastMessage",
          message: "Icon needs to be 1024px, yours is " + height + "px x " + width + "px",
          variant: "error"
        })
      } else {
        const fileName = file.name.replace('.png', '')
        const randId = Math.floor(Math.random() * 10000000 + 1) + "-" + fileName + Object.keys(filesToShow).length

        filesToUpload[randId] = file

        const value = {
          img: objectURL,
          name: fileName,
          file: file,
          isDarkMode: false,
          isLiquidGlass: false,
          isAuthor: false,
          category: "",
          appWebsite: "",
          type: "Zz9QX1BBIZ",
          randId: randId,
        }

        imageData.value = true
        filesToShow[randId] = value
      }
    }
    img.src = objectURL
  }

  totalNumFiles.value = Object.keys(filesToShow).length
  event.target.value = ''
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

async function onUpload() {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const dateStr = dd + '/' + mm + '/' + yyyy

  window.plausible?.("IconSubmission", { props: { date: dateStr } })

  isLoading.value = true
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
      const pngFileBase64 = await fileToBase64(iconData.file)
      let icnsFileBase64 = null
      let icnsFileName = null
      if (iconData.icnsFile) {
        icnsFileBase64 = await fileToBase64(iconData.icnsFile)
        icnsFileName = iconData.icnsFile.name
      }

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

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + 'v1/icons/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-parse-session-token': sessionToken
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload icon')
      }

      uploadProgress.value++
      delete filesToShow[randId]
      delete filesToUpload[randId]

    } catch (error) {
      isLoading.value = false
      showToast({
        id: "toastMessage",
        message: error.message || "There was an error uploading the icon",
        variant: "error"
      })
      return
    }
  }

  isLoading.value = false
  imageData.value = false
  uploadProgress.value = 0

  showToast({
    id: "toastMessage",
    message: "All icons have been uploaded.",
    variant: "success"
  })
  isOpen.value = false
}

// Lifecycle
onMounted(() => {
  fetchAppCategories()
  fetchIconType()
})
</script>
