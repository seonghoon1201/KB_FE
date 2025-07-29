<template>
    <div class="border-b py-4">
        <div class="flex justify-between items-center">
            <div>
                <p class="font-semibold">{{ label }}</p>
                <p class="text-xs text-gray-500">{{ info }}</p>
            </div>
            <div class="flex items-center gap-2">
                <button @click="decrease" class="w-8 h-8 border rounded">-</button>
                <span>{{ modelValue }}</span>
                <button @click="increase" class="w-8 h-8 border rounded">+</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    info: String,
    modelValue: Number,
})

const emit = defineEmits(['update:modelValue'])

const increase = () => {
    emit('update:modelValue', props.modelValue + 1)
}

const decrease = () => {
    if (props.modelValue > 0) emit('update:modelValue', props.modelValue - 1)
}
</script>
