<template>
    <div class="min-h-screen bg-white pt-[56px] pb-[60px]">
        <ModalBase />
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ModalBase from './components/common/ModalBase.vue'
</script>
