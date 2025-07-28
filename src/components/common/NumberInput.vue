<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-800">{{ label }}</label>
    <input
      type="number"
      class="w-full border rounded px-3 py-2 text-sm"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.valueAsNumber)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
})
defineEmits(['update:modelValue'])
</script>
