<template>
  <UModal v-model:open="isOpen" title="Delete Confirmation">
    <template #header>
      <h3 class="text-lg font-semibold">Are you sure you want to delete {{ icon.appName }}?</h3>
    </template>

    <div class="p-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton color="red" @click="deleteIcon(icon)">Delete</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import Parse from 'parse';;

const props = defineProps({
  icon: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const isOpen = ref(false)

// Expose method to open dialog
const open = () => {
  isOpen.value = true
}

// Watch for external changes
watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Expose for parent component
defineExpose({ open })

function showToast(payload) {
  store.dispatch('showToast', payload)
}

function handleParseError(error) {
  store.dispatch('handleParseError', error)
}

async function deleteIcon(icon) {
  const Icons = Parse.Object.extend("Icons2")

  console.log("iconId: ", icon.id)
  console.log("appName: ", icon.appName)

  const query = new Parse.Query(Icons)
  const docToDelete = await query.get(icon.id)

  docToDelete.destroy().then(() => {
    store.dispatch('deleteItem', icon)
    isOpen.value = false
    showToast({
      id: "toastMessage",
      message: icon.appName + " has been deleted.",
      variant: "success"
    })
  }).catch((error) => {
    handleParseError(error)
  })
}
</script>
