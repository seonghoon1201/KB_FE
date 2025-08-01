<!-- src/components/AreaSettingModal.vue -->
<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl w-[300px] p-6 space-y-4 shadow-md">
            <h2 class="text-lg font-bold text-center">평수 설정</h2>

            <div class="flex flex-col gap-2">
                <button
                    v-for="option in options"
                    :key="option.value"
                    @click="select(option.value)"
                    :class="[
                        'border px-4 py-2 rounded-md text-sm transition',
                        selectedValue === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                            : 'hover:bg-gray-100',
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
import { ref, watch } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: null,
    },
})

// 예치금 기준표에 맞춘 면적 카테고리
const options = [
    { label: '~ 85㎡(34평)', value: 85 },
    { label: '85㎡ ~ 102㎡(41평)', value: 102 },
    { label: '102㎡ ~ 135㎡(53평)', value: 135 },
    { label: '135㎡(53평) ~', value: 'all' },
]

const selectedValue = ref(props.modelValue)

// 부모가 v-model 으로 바꿀 때 내부에서도 업데이트
watch(
    () => props.modelValue,
    (v) => {
        selectedValue.value = v
    },
)

function select(value) {
    selectedValue.value = value
}

function confirm() {
    emit('save', selectedValue.value)
    emit('close')
}
</script>
