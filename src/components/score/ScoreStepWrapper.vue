<template>
    <div class="min-h-screen bg-white px-4 pt-20 pb-10">
        <BackHeader title="가점 계산기" />
        <h2 class="text-lg font-bold mb-6">{{ title }}</h2>
        <slot />
    </div>
</template>

<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
const props = defineProps({ title: String })
</script>
