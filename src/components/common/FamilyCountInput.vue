<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-800">{{ label }}</label>
    <div class="grid grid-cols-1 gap-2">
      <div class="flex items-center gap-3">
        <span class="w-32 text-sm">배우자</span>
        <input type="number" min="0" class="flex-1 border px-2 py-1 rounded text-sm" v-model.number="modelValue.spouse" />
      </div>
      <div class="flex items-center gap-3">
        <span class="w-32 text-sm">부모/조부모</span>
        <input type="number" min="0" class="flex-1 border px-2 py-1 rounded text-sm" v-model.number="modelValue.ascendant" />
      </div>
      <div class="flex items-center gap-3">
        <span class="w-32 text-sm">자녀/손자녀</span>
        <input type="number" min="0" class="flex-1 border px-2 py-1 rounded text-sm" v-model.number="modelValue.descendant" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ label: String })
defineModel()
</script>
