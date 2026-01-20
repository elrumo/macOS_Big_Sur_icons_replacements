<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'max-w-sm' }">
    <div class="p-6 text-center">
      <img class="w-12 mx-auto mb-4" :src="imgs.macOSiconsLogo" alt="macOSicons logo">

      <h3 class="text-xl font-semibold mb-2">
        Want to save an icon?
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        To save an icon, you need to have an account. Create an account to save icons, submit new ones and more!
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" @click="isOpen = false">
          Close
        </UButton>
        <UButton color="primary" @click="openLoginDialog">
          Login or sign up
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import logoLowRes from "../assets/Resources/logo_lowres.png"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'openLogin'])

const isOpen = ref(false)

const imgs = {
  macOSiconsLogo: logoLowRes
}

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

function openLoginDialog() {
  isOpen.value = false
  emit('openLogin')
  // Also try to open the login dialog directly for backward compatibility
  const loginDialog = document.getElementById('loginDialog')
  if (loginDialog && typeof loginDialog.show === 'function') {
    loginDialog.show()
  }
}
</script>
