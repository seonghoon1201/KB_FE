<template>
    <div class="min-h-screen bg-white relative border border-red-600">
        <ModalBase class="border border-black" />
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ModalBase from './components/common/ModalBase.vue'
</script>
