<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'max-w-xl' }">
    <template #header>
      <h3 class="text-lg font-semibold">Submit an icon</h3>
    </template>

    <div class="p-4">
      <div class="mb-4">
        <p class="font-semibold text-sm mb-2">We'll let you know by email when the icon has been approved.</p>
        <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>Icon submitted must be a .png file</li>
          <li>
            Download template from the
            <router-link to="/resources" class="text-primary underline" @click="isOpen = false">
              resources page.
            </router-link>
          </li>
          <li><strong>The file name must be the same as the name of the app.</strong></li>
        </ul>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <UProgress animation="carousel" class="mb-2" />
          <p class="text-sm">{{ uploadProgress }}/{{ totalNumFiles }} icons uploaded</p>
        </div>
      </div>

      <!-- File Upload Area -->
      <div class="icon-upload-grid">
        <!-- Preview with files -->
        <div v-if="imageData" class="grid grid-cols-4 gap-3 mb-4">
          <div v-for="icon in filesToShow" :key="icon.name" class="relative group">
            <img :src="icon.img" class="w-full aspect-square object-contain rounded-lg border border-gray-200 dark:border-gray-700">
            <UButton
              icon="i-heroicons-x-mark"
              size="xs"
              color="red"
              variant="solid"
              class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeFile(icon.name)"
            />
          </div>

          <!-- Add more files button -->
          <label class="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="file"
              accept="image/png"
              multiple
              class="hidden"
              @change="selectIcon"
            >
            <UIcon name="i-heroicons-plus" class="w-8 h-8 text-gray-400" />
            <span class="text-xs text-gray-500 mt-1">Add files</span>
          </label>
        </div>

        <!-- Empty state - drop zone -->
        <label v-else class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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

        <!-- Checkboxes -->
        <div class="mt-4 space-y-2">
          <UCheckbox v-model="isReupload" label="I'm re-uploading an icon that was previously on the site" />
          <div class="flex items-center gap-2">
            <UCheckbox v-model="isAuthor" label="I'm the original author of these icons." />
            <span class="text-xs text-gray-500">(It's ok if you aren't)</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton
          v-if="imageData && email !== ''"
          color="primary"
          @click="onUpload"
        >
          Upload
        </UButton>
        <UButton v-else disabled>Upload</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse/dist/parse.min.js'

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
const uploadProgress = ref(0)
const totalNumFiles = ref(0)
const email = ref("")
const credit = ref("")
const appName = ref("")
const yourName = ref("")
const isLoading = ref(false)
const isReupload = ref(false)
const isAuthor = ref(false)

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

function showToast(payload) {
  store.dispatch('showToast', payload)
}

function removeFile(iconName) {
  delete filesToShow[iconName]
  delete filesToUpload[iconName]
  if (Object.keys(filesToShow).length === 0) {
    imageData.value = false
  }
}

function selectIcon(event) {
  const files = event.target.files

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
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
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  today = dd + '/' + mm + '/' + yyyy

  window.plausible?.("IconSubmission", { props: { date: today } })

  isLoading.value = true

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

    const parseFile = new Parse.File(fileName, file)
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
        isReupload: isReupload.value,
        isAuthor: isAuthor.value,
        timeStamp: Date.now(),
        approved: false,
        user: currentUser
      }

      icons.set(dataToStore)
      icons.save().then((icon) => {
        const userRelation = currentUser.relation("icons")
        userRelation.add(icons)
        currentUser.save()

        icon.set("alogliaID", icons.id)
        icon.save()

        imageData.value = false
        uploadProgress.value++
        console.log("Document successfully written!")

        delete filesToUpload[currentAppName]
        delete filesToShow[currentAppName]
        if (Object.keys(filesToUpload).length === 0) {
          isLoading.value = false
          imageData.value = false
          email.value = ""
          uploadProgress.value = 0

          showToast({
            id: "toastMessage",
            message: "All icons have been uploaded.",
            variant: "success"
          })
          isOpen.value = false
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
    })
  }
}
</script>

<style scoped>
.icon-upload-grid {
  position: relative;
}
</style>
