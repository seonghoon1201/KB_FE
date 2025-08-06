<template>
    <div class="min-h-screen bg-white relative">
        <ModalBase class="border border-black" />
        <RouterView />
        <InstallPrompt />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'
import { useUserStore } from '@/stores/user'
import scoreApi from '@/api/scoreApi'
import { onMounted } from 'vue'
import InstallPrompt from '@/components/common/InstallPrompt.vue'
import ModalBase from './components/modal/ModalBase.vue'

onMounted(async () => {
    const accountStore = useAccountStore()
    await accountStore.fetchAccount()
    const userStore = useUserStore()
    const scoreStore = useScoreStore()

    if (userStore.isLoggedIn) {
        try {
            const res = await scoreApi.getLastScore()
            scoreStore.setScore(res.data)
        } catch (err) {
            console.warn('[초기 가점 정보 로딩 실패]', err)
        }
    }
})
</script>
