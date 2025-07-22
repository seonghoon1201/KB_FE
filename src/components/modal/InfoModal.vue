<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-sm p-5 relative">
      <h2 class="text-lg font-bold text-gray-800 mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-700 whitespace-pre-line">{{ message }}</p>
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-black"
        aria-label="닫기"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  visible: Boolean,
  title: String,
  message: String,
})
defineEmits(['close'])
</script>
