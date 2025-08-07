<!-- src/pages/auth/KakaoCallbackPage.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center">
        <p class="text-gray-500">카카오 로그인 처리 중입니다...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authApi from '@/api/authApi'
import accountApi from '@/api/accountApi'
import scoreApi from '@/api/scoreApi'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const scoreStore = useScoreStore()

onMounted(async () => {
    const code = route.query.code
    console.log('카카오 code:', code)

    if (!code) {
        alert('카카오 로그인 코드가 없습니다.')
        router.push('/login')
        return
    }

    try {
        // ✅ 서버에 code 전달
        const res = await authApi.kakaoLogin(code)
        const { access_token, refresh_token, user } = res.data

        userStore.setAuth({
            access_token,
            refresh_token,
            user,
        })

        // ✅ 계좌 정보 불러오기
        try {
            const res2 = await accountApi.fetch()
            accountStore.setAccount(res2.data)
        } catch (e) {
            console.error('계좌 불러오기 실패:', e)
        }

        // ✅ 가점 정보 불러오기
        try {
            const res3 = await scoreApi.getLastScore()
            scoreStore.setScore(res3.data)
        } catch (e) {
            console.error('가점 정보 불러오기 실패:', e)
        }

        router.push('/home')
    } catch (err) {
        console.error(err)
        alert('카카오 로그인 실패. 다시 시도해주세요.')
        router.push('/login')
    }
})
</script>
