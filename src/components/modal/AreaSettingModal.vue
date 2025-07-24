<!-- 게좌 연결 시 예치금 기준 위해 평수 설정하는 필터 -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl w-[300px] p-6 space-y-4 shadow-md">
      <h2 class="text-lg font-bold text-center">평수 설정</h2>

      <div class="flex flex-col gap-2">
        <button
          v-for="option in options"
          :key="option.label"
          @click="select(option.value)"
          :class="[
            'border px-4 py-2 rounded-md text-sm transition',
            selectedValue === option.value
              ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
              : 'hover:bg-gray-100'
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex gap-2 mt-4">
        <button
          class="flex-1 py-2 rounded-md bg-gray-100 text-sm text-gray-600"
          @click="$emit('close')"
        >
          취소
        </button>
        <button
          class="flex-1 py-2 rounded-md bg-blue-500 text-white text-sm font-semibold"
          @click="confirm"
          :disabled="selectedValue === null"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  modelValue: Number
})

const selectedValue = ref(props.modelValue ?? null)

const options = [
  { label: '60㎡ 이하', value: 60 },
  { label: '60㎡ ~ 85㎡', value: 85 },
  { label: '85㎡ ~ 100㎡', value: 100 },
  { label: '100㎡ ~ 135㎡', value: 135 },
  { label: '135㎡ 이상', value: 136 }
]

const select = (value) => {
  selectedValue.value = value
}

const confirm = () => {
  emit('save', selectedValue.value)
  emit('close')
}
</script>
