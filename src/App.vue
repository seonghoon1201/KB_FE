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
    const userStore = useUserStore()
    const accountStore = useAccountStore()
    const scoreStore = useScoreStore()

    if (userStore.isLoggedIn && userStore.accessToken) {
        try {
            await accountStore.fetchAccount()
        } catch (err) {
            console.warn('[초기 계좌 정보 로딩 실패]', err)
        }

        try {
            const res = await scoreApi.getLastScore()
            scoreStore.setScore(res.data)
        } catch (err) {
            console.warn('[초기 가점 정보 로딩 실패]', err)
        }
    } else {
        console.log('[App.vue] 로그인 상태 아님 → 계좌/가점 요청 생략')
    }
})
</script>
