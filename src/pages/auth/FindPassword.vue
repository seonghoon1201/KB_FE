<template>
    <div
        class="min-h-screen bg-white flex flex-col items-center justify-center relative px-4 sm:px-6"
    >
        <!-- 뒤로가기 버튼 -->
        <button
            @click="goBack"
            class="absolute top-5 left-4 sm:top-6 sm:left-6 text-black"
            aria-label="뒤로가기"
        >
            <LucideArrowLeft class="w-6 h-6" />
        </button>

        <!-- 로고 -->
        <img
            src="@/assets/images/logo.png"
            alt="집을 구하는 지비 로고"
            class="w-full max-w-[200px] sm:max-w-[240px] mb-8"
        />

        <!-- 설명 텍스트 -->
        <p class="text-sm sm:text-base text-gray-500 text-center mb-6">
            비밀번호를 찾고자 하는 이메일을 입력해주세요
        </p>

        <!-- 이메일 입력 -->
        <div class="w-full max-w-md mb-6">
            <div class="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <span class="mr-2 text-lg">📧</span>
                <input
                    v-model="email"
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
                />
            </div>
        </div>

        <!-- 다음 버튼 -->
        <button
            type="button"
            @click="handleSubmit"
            :disabled="sending"
            class="w-full max-w-md bg-[#3685F2] hover:bg-[#2c6fd6] text-white text-sm sm:text-base font-semibold py-2 rounded-md disabled:opacity-50"
        >
            {{ sending ? '전송 중…' : '다음' }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next'
import authApi from '@/api/authApi'

const email = ref('')
const sending = ref(false)
const router = useRouter()

const goBack = () => {
    router.back()
}

async function handleSubmit() {
    if (!email.value) {
        alert('이메일을 입력해주세요.')
        return
    }

    sending.value = true
    try {
        // 인증코드 발송 API 호출
        await authApi.sendEmailCode({ user_id: email.value })
        // 발송 성공하면 검증 페이지로 이동
        router.push({
            path: '/find-password/verify',
            query: { email: email.value },
        })
    } catch (err) {
        console.error(err)
        alert(err.response?.data || '인증 코드 전송에 실패했습니다.')
    } finally {
        sending.value = false
    }
}
</script>
