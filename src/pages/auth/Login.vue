<template>
    <div class="h-screen w-screen bg-white flex items-center justify-center px-6">
        <div class="w-full max-w-[328px] flex flex-col items-center gap-6">
            <img
                src="@/assets/images/logo.png"
                alt="로고"
                class="w-full max-w-[280px] sm:max-w-[300px]"
            />

            <!-- form 태그 + @submit.prevent 로 단 한 번만 호출 -->
            <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">
                <div>
                    <label class="text-xs text-[#8D8D8D] mb-1 block">이메일</label>
                    <input
                        v-model="email"
                        type="email"
                        placeholder="이메일을 입력해 주세요."
                        class="w-full border-b border-[#D9D9D9] py-2 text-sm placeholder-[#C4C4C4] focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label class="text-xs text-[#8D8D8D] mb-1 block">비밀번호</label>
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
import api from '@/api/axios'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

async function handleLogin() {
    if (!email.value || !password.value) {
        alert('이메일과 비밀번호를 모두 입력해주세요.')
        return
    }
    loading.value = true
    try {
        // 프록시 덕분에 '/v1/auth/login' → 백엔드로 전달
        const res = await api.post('/auth/login', {
            user_id: email.value,
            password: password.value,
        })
        const { accessToken, refreshToken, user, users } = res.data
        const u = user ?? users
        if (!u) throw new Error('서버에서 사용자 정보를 찾을 수 없습니다.')

        userStore.setAuth({ accessToken, refreshToken, user: u })
        router.push('/')
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
