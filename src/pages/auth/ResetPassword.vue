<template>
    <div class="min-h-screen bg-white px-4 sm:px-6 py-4 flex flex-col">
        <!-- 🔹 상단 고정 헤더 -->
        <div class="flex items-center mb-6">
            <button @click="goBack" aria-label="뒤로가기">
                <LucideArrowLeft class="w-6 h-6 text-black" />
            </button>
            <h1 class="text-base sm:text-lg font-semibold ml-2">비밀번호 재설정</h1>
        </div>

        <!-- 🔹 본문 -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <div class="w-full max-w-md flex flex-col items-center gap-6 -translate-y-5">
                <!-- ✅ 로고 -->
                <img
                    src="@/assets/images/logo.png"
                    alt="지비 로고"
                    class="w-full max-w-[200px] sm:max-w-[240px] mb-8"
                />

                <!-- 제목 -->
                <h2 class="text-xl font-bold text-center">비밀번호 재설정</h2>

                <!-- 설명 -->
                <p class="text-sm sm:text-base text-gray-500 text-center leading-relaxed">
                    비밀번호는 8~20자의 영문, 숫자를 포함해야 합니다.
                </p>

                <!-- 비밀번호 입력 -->
                <div class="w-full flex flex-col gap-1">
                    <div
                        class="relative flex items-center border border-gray-300 rounded-md px-3 py-2"
                    >
                        <span class="mr-2 text-lg">🔒</span>
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="새 비밀번호 입력"
                            class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
                            :disabled="sending"
                            autocomplete="new-password"
                            inputmode="text"
                        />
                        <!-- 눈 아이콘 버튼 -->
                        <button
                            type="button"
                            @click="togglePassword"
                            :aria-pressed="showPassword"
                            aria-label="비밀번호 표시 전환"
                            class="absolute right-2 text-gray-500 hover:text-black p-1"
                        >
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="password && !isPasswordValid" class="text-red-500 text-sm">
                        비밀번호는 문자와 숫자를 모두 포함하여 8~20자여야 합니다.
                    </p>
                </div>

                <!-- 비밀번호 확인 -->
                <div class="w-full flex flex-col gap-1">
                    <div
                        class="relative flex items-center border border-gray-300 rounded-md px-3 py-2"
                    >
                        <span class="mr-2 text-lg">🔒</span>
                        <input
                            v-model="confirmPassword"
                            :type="showConfirm ? 'text' : 'password'"
                            placeholder="비밀번호 확인"
                            class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
                            :disabled="sending"
                            autocomplete="new-password"
                            inputmode="text"
                        />
                        <!-- 눈 아이콘 버튼 -->
                        <button
                            type="button"
                            @click="toggleConfirm"
                            :aria-pressed="showConfirm"
                            aria-label="비밀번호 확인 표시 전환"
                            class="absolute right-2 text-gray-500 hover:text-black p-1"
                        >
                            <Eye v-if="!showConfirm" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="confirmPassword && !isPasswordMatch" class="text-red-500 text-sm">
                        비밀번호가 일치하지 않습니다.
                    </p>
                </div>

                <!-- 버튼 -->
                <button
                    type="button"
                    @click="handleSubmit"
                    :disabled="sending || !isPasswordValid || !isPasswordMatch"
                    class="w-full bg-[#3685F2] hover:bg-[#2c6fd6] text-white text-sm sm:text-base font-semibold py-2 rounded-md disabled:opacity-50"
                >
                    {{ sending ? '변경 중…' : '비밀번호 변경' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft as LucideArrowLeft, Eye, EyeOff } from 'lucide-vue-next'
import authApi from '@/api/authApi'

// router & route
const router = useRouter()
const route = useRoute()

// 이메일 (find-password/verify 에서 query 로 전달됨)
const email = ref(route.query.email ?? '')
if (!email.value) {
    alert('이메일 정보가 없습니다.')
    router.back()
}

// form state
const password = ref('')
const confirmPassword = ref('')
const sending = ref(false)

// 보기/숨기기 상태
const showPassword = ref(false)
const showConfirm = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)
const toggleConfirm = () => (showConfirm.value = !showConfirm.value)

// 뒤로가기
const goBack = () => router.back()

// 비밀번호 유효성: 문자+숫자 포함 8~20자
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
const isPasswordValid = computed(() => passwordRegex.test(password.value))

// 비밀번호 일치 여부
const isPasswordMatch = computed(() => password.value === confirmPassword.value)

// 제출 핸들러
async function handleSubmit() {
    if (!password.value || !confirmPassword.value) {
        alert('모든 칸을 입력해주세요.')
        return
    }
    if (!isPasswordValid.value) {
        alert('비밀번호는 문자와 숫자를 모두 포함하여 8~20자여야 합니다.')
        return
    }
    if (!isPasswordMatch.value) {
        alert('비밀번호가 일치하지 않습니다.')
        return
    }

    sending.value = true
    try {
        await authApi.refreshPassword({
            user_id: email.value,
            new_password: password.value,
        })
        alert('비밀번호가 성공적으로 변경되었습니다.')
        router.push('/login')
    } catch (err) {
        console.error(err)
        alert(err.response?.data || '비밀번호 변경에 실패했습니다.')
    } finally {
        sending.value = false
    }
}
</script>
