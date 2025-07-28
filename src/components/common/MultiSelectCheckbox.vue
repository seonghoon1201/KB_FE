<template>
    <div class="space-y-2">
        <p class="text-sm font-medium text-gray-800">{{ label }}</p>
        <div class="flex flex-wrap gap-3">
            <label v-for="option in options" :key="option" class="flex items-center gap-1">
                <input
                    type="checkbox"
                    :value="option"
                    :checked="modelValue.includes(option)"
                    @change="onChange(option, $event)"
                />
                {{ option }}
            </label>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    options: Array,
    modelValue: Array,
})
const emit = defineEmits(['update:modelValue'])

const onChange = (option, event) => {
    const newValue = [...props.modelValue]
    if (event.target.checked) {
        if (!newValue.includes(option)) newValue.push(option)
    } else {
        const index = newValue.indexOf(option)
        if (index > -1) newValue.splice(index, 1)
    }
    emit('update:modelValue', newValue)
}
</script>
