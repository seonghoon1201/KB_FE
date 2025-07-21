<template>
    <div class="min-h-screen bg-white">
        <ModalBase />
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ModalBase from './components/common/ModalBase.vue'
</script>
