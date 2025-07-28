<template>
    <div class="space-y-2">
        <p class="text-sm font-medium text-gray-800">{{ question }}</p>
        <div class="flex gap-4">
            <label class="flex items-center gap-1">
                <input
                    type="radio"
                    :checked="modelValue === true"
                    @change="$emit('update:modelValue', true)"
                />
                예
            </label>
            <label class="flex items-center gap-1">
                <input
                    type="radio"
                    :checked="modelValue === false"
                    @change="$emit('update:modelValue', false)"
                />
                아니오
            </label>
        </div>
    </div>
</template>
<script setup>
defineProps({ question: String, modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>
