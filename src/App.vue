<template>
    <div class="min-h-screen bg-white relative">
        <ModalBase class="border border-black" />
        <RouterView />
        <InstallPrompt/>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import InstallPrompt from '@/components/common/InstallPrompt.vue'
import ModalBase from './components/modal/ModalBase.vue'
</script>
