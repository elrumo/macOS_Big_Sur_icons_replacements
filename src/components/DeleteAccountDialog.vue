<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'max-w-md' }">
    <template #header>
      <h3 class="text-lg font-semibold">Delete Your Account</h3>
    </template>

    <div class="p-4">
      <div class="delete-account-warning">
        <h4 class="text-sm font-medium mb-2">⚠️ This action cannot be undone</h4>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Deleting your account will permanently remove:
        </p>

        <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 mb-3 space-y-1">
          <li>Your profile and all personal information</li>
          <li>All icons you have uploaded ({{ userIconsCount }} icons)</li>
          <li>Your saved icons collection</li>
          <li>All account settings and preferences</li>
        </ul>

        <UAlert
          color="red"
          variant="soft"
          title="This action is final and cannot be reversed."
          class="mb-4"
        />

        <div class="space-y-3">
          <UFormField label="Type &quot;DELETE&quot; to confirm:">
            <UInput
              v-model="confirmationText"
              placeholder="Type DELETE here"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Your password:">
            <UInput
              v-model="userPassword"
              type="password"
              placeholder="Password"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton
          color="red"
          :disabled="(confirmationText !== 'DELETE' || isDeleting) || userPassword.length < 3"
          :loading="isDeleting"
          @click="deleteAccount"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const isOpen = ref(false)
const confirmationText = ref('')
const userPassword = ref('')
const isDeleting = ref(false)

// Computed
const getUser = computed(() => store.getters.getUser)
const approvedIconsCount = computed(() => store.getters.approvedIconsCount)

const userIconsCount = computed(() => {
  return (approvedIconsCount.value?.approved || 0) + (approvedIconsCount.value?.notApproved || 0)
})

// Watch for external changes
watch(() => props.modelValue, (val) => {
  isOpen.value = val
  if (val) {
    confirmationText.value = ''
    userPassword.value = ''
  }
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Expose method to open dialog
const open = () => {
  isOpen.value = true
  confirmationText.value = ''
  userPassword.value = ''
}

defineExpose({ open })

// Methods
function showToast(payload) {
  store.dispatch('showToast', payload)
}

function logOut() {
  store.dispatch('logOut')
}

function handleParseError(error) {
  store.dispatch('handleParseError', error)
}

async function deleteUserAccount(password) {
  return store.dispatch('deleteUserAccount', password)
}

async function deleteAccount() {
  if (confirmationText.value !== 'DELETE') {
    return
  }

  isDeleting.value = true

  try {
    await deleteUserAccount(userPassword.value)

    isOpen.value = false

    showToast({
      id: "toastMessage",
      message: "Your account has been successfully deleted.",
      variant: "success"
    })

    logOut()

  } catch (error) {
    console.error('Error deleting account:', error)
    handleParseError(error)

    showToast({
      id: "toastMessage",
      message: "Failed to delete account. Please try again or contact support.",
      variant: "error"
    })
  } finally {
    isDeleting.value = false
    confirmationText.value = ''
  }
}
</script>

<style scoped>
.delete-account-warning {
  padding: 8px 0;
}
</style>
