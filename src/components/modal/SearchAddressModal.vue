
<template>
    <div
        v-if="visible"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-lg p-6 w-full mx-8 w-80">
            <h3 class="text-lg font-bold mb-4">주소 검색</h3>
            <div class="mb-2">
                <label>시/도</label>
                <select v-model="selectedCity" class="w-full border rounded p-2 mt-1">
                    <option value="">선택</option>
                    <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>
            </div>
            <div class="mb-2">
                <label>군/구</label>
                <select
                    v-model="selectedDistrict"
                    class="w-full border rounded p-2 mt-1"
                    :disabled="!selectedCity"
                >
                    <option value="">선택</option>
                    <option v-for="gu in districts[selectedCity]" :key="gu">{{ gu }}</option>
                </select>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <button @click="$emit('close')" class="px-4 py-2 rounded bg-gray-200">취소</button>
                <button
                    :disabled="!selectedCity || !selectedDistrict"
                    @click="applyAddress"
                    class="px-4 py-2 rounded bg-blue-500 text-white"
                >
                    선택
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { districts } from '@/data/districts'

const props = defineProps({
    visible: Boolean,
})
const emit = defineEmits(['close', 'selected'])

const selectedCity = ref('')
const selectedDistrict = ref('')
const cities = Object.keys(districts)

const applyAddress = () => {
    emit('selected', `${selectedCity.value} ${selectedDistrict.value}`)
    emit('close')
}

const searchAddress = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      address.value = data.address
    },
  }).open()
}

watch(
    () => props.visible,
    (v) => {
        if (v) {
            selectedCity.value = ''
            selectedDistrict.value = ''
        }
    },
)
</script>
