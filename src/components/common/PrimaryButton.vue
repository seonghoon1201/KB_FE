<template>
    <button
        v-bind="$attrs"
        class="w-full h-10 bg-[#00AEFF] text-white text-sm font-semibold rounded-[10px] flex items-center justify-center"
        :class="customClass"
        @click="handleClick"
    >
        <slot />
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    customClass: { type: String, default: '' },
})

const emit = defineEmits(['click'])

function handleClick(event) {
    event.stopImmediatePropagation()
    emit('click', event)
}
</script>
