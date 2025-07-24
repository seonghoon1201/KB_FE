<template>
    <div class="min-h-screen bg-white relative">
        <ModalBase class="border border-black" />
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ModalBase from './components/common/ModalBase.vue'
</script>
