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
                    <div class="relative">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="비밀번호를 입력해 주세요."
                            class="w-full border-b border-[#D9D9D9] py-2 pr-8 text-sm placeholder-[#C4C4C4] focus:outline-none focus:border-black"
                        />
                        <!-- Lucide 아이콘: Eye / EyeOff -->
                        <button
                            type="button"
                            @click="togglePassword"
                            class="absolute right-0 top-1/2 -translate-y-1/2 pr-2 text-gray-500 hover:text-black"
                        >
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
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
import alarmApi from '@/api/notificationApi'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'
import { Eye, EyeOff } from 'lucide-vue-next'
import { setupMessaging } from '@/firebase'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const scoreStore = useScoreStore()

function togglePassword() {
    showPassword.value = !showPassword.value
}

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

        // ✅ ③ 가점 점수 정보도 불러오기
        try {
            const res3 = await scoreApi.getLastScore()
            scoreStore.setScore(res3.data)
        } catch (err) {
            console.error(err)
        }

        // fcm 토큰 저장
        try {
            const { token } = await setupMessaging(import.meta.env.VITE_VAPID_PUBLIC_KEY)
            console.log('login token : ', token)
            if (token) {
                await alarmApi.saveToken(token)
            }
        } catch (err) {
            console.error('FCM 토큰 저장 실패:', err)
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

async function handleKakaoLogin() {
    loading.value = true
    try {
        // ① 카카오 로그인 페이지로 리디렉션해서 code 받기
        const clientId = '53da207a5cc86b7ec03890c960d2937b' // 실제 REST API 키
        const redirectUri = 'https://zibi.vercel.app/kakao/callback' // 프론트엔드 콜백 URL
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

        window.location.href = kakaoAuthUrl
    } catch (err) {
        console.error(err)
        alert('카카오 로그인 중 오류가 발생했습니다.')
    } finally {
        loading.value = false
    }
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
