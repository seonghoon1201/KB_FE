<template>
  <div>
    <label v-if="label" class="text-sm font-semibold text-gray-800 mb-1 block">{{ label }}</label>
    <select
      v-model="selected"
      @change="$emit('update:modelValue', selected)"
      class="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.label" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: Array,
  label: String,
  placeholder: {
    type: String,
    default: '선택해주세요'
  }
})

const selected = ref(props.modelValue)

watch(() => props.modelValue, val => (selected.value = val))
</script>
