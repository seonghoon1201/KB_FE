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
import { usePreferenceStore } from '@/stores/preference'
import { useRecommendationStore } from '@/stores/recommendation'
import scoreApi from '@/api/scoreApi'
import { onMounted } from 'vue'
import InstallPrompt from '@/components/common/InstallPrompt.vue'
import ModalBase from './components/modal/ModalBase.vue'

onMounted(async () => {
    const userStore = useUserStore()
    const accountStore = useAccountStore()
    const scoreStore = useScoreStore()
    const prefStore = usePreferenceStore()
    const recStore = useRecommendationStore()

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

        // ✅ 선호 정보 저장(동기화): 서버 → 스토어(setFromServer) → 로컬(persist)
        try {
            await prefStore.hydrate()
            // 선택: 선호가 설정되어 있으면 추천도 미리 채워두기
            if (prefStore.isSet) await recStore.fetch()
        } catch (err) {
            console.warn('[초기 선호 정보 로딩 실패]', err)
        }
    } else {
        console.log('[App.vue] 로그인 상태 아님 → 계좌/가점 요청 생략')
    }
})
</script>
