<template>
    <div class="min-h-screen bg-white relative">
        <ModalBase class="border border-black" />
        <RouterView />
        <InstallPrompt/>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { onMounted } from 'vue'
import InstallPrompt from '@/components/common/InstallPrompt.vue'
import ModalBase from './components/modal/ModalBase.vue'

onMounted(async () => {
    const accountStore = useAccountStore()
    await accountStore.fetchAccount()
})
</script>
