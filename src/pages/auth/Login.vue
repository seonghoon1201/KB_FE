<template>
    <div class="min-h-screen bg-white flex items-center justify-center px-6 overflow-x-hidden">
        <div class="w-full max-w-[328px] flex flex-col items-center gap-2">
            <img
                src="@/assets/images/logo.png"
                alt="로고"
                class="w-full max-w-[280px] sm:max-w-[300px]"
            />

            <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-6">
                <div>
                    <label class="text-xs text-[#8D8D9] mb-1 block">이메일</label>
                    <input
                        v-model="email"
                        type="email"
                        placeholder="이메일을 입력해 주세요."
                        class="w-full border-b border-[#D9D9D9] py-2 text-sm placeholder-[#C4C4C4] focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label class="text-xs text-[#8D8D9] mb-1 block">비밀번호</label>
                    <input
                        v-model="password"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요."
                        class="w-full border-b border-[#D9D9D9] py-2 text-sm placeholder-[#C4C4C4] focus:outline-none focus:border-black"
                    />
                </div>

                <PrimaryButton
                    type="submit"
                    :disabled="loading"
                    class="w-full h-[44px] bg-[#4EA1FF] text-white rounded-[8px] text-sm font-semibold"
                >
                    {{ loading ? '로그인 중...' : '로그인' }}
                </PrimaryButton>
            </form>

            <button
                @click="handleKakaoLogin"
                class="w-full h-[44px] bg-[#FEE500] text-black text-sm font-medium rounded-[8px] flex items-center justify-center gap-1"
            >
                <img src="@/assets/images/kakao-icon.png" alt="카카오" class="w-[16px] h-[16px]" />
                카카오로 이용하기
            </button>

            <div class="text-[12px] text-[#7E7E7E] flex justify-center gap-6 w-full">
                <span class="cursor-pointer hover:underline" @click="goToFindPassword">
                    비밀번호 찾기
                </span>
                <span class="text-[#D9D9D9]">|</span>
                <span class="cursor-pointer hover:underline" @click="goToSignUp"> 회원가입 </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import authApi from '@/api/authApi'
import accountApi from '@/api/accountApi'
import scoreApi from '@/api/scoreApi'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const scoreStore = useScoreStore()

async function handleLogin() {
    if (!email.value || !password.value) {
        alert('이메일과 비밀번호를 모두 입력해주세요.')
        return
    }

    loading.value = true
    try {
        // ① 로그인 API 호출
        const res = await authApi.login({
            user_id: email.value,
            password: password.value,
        })

        // ② 응답 구조에 맞춰서 분해
        const { access_token, refresh_token, user } = res.data

        // ③ Pinia 스토어에 저장
        userStore.setAuth({
            access_token,
            refresh_token,
            user,
        })

        // 계좌 정보 불러오기
        try {
            const res2 = await accountApi.fetch()
            accountStore.setAccount(res2.data)
        } catch (err) {
            console.error(err)
        }
        try {
            const res2 = await accountApi.fetch()
            accountStore.setAccount(res2.data)
        } catch (err) {
            console.error(err)
        }

        // ✅ ③ 가점 점수 정보도 불러오기
        try {
            const res3 = await scoreApi.getLastScore()
            scoreStore.setScore(res3.data)
        } catch (err) {
            console.error(err)
        }

        // ④ 홈으로 이동
        router.push('/home')
    } catch (err) {
        console.error(err)
        alert('로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.')
    } finally {
        loading.value = false
    }
}

function handleKakaoLogin() {
    console.log('카카오 로그인 (추후 SDK 연동)')
}

function goToSignUp() {
    router.push('/signup')
}

function goToFindPassword() {
    router.push('/find-password')
}
</script>

<style scoped>
html,
body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
</style>
