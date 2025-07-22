<template>
  <button
    class="w-full h-10 bg-[#00AEFF] text-white text-sm font-semibold rounded-[10px] flex items-center justify-center"
    :class="customClass"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: '',
  },
})
</script>
