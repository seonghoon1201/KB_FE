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
          비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
        </p>

        <!-- 비밀번호 입력 -->
        <div class="w-full flex items-center border border-gray-300 rounded-md px-3 py-2">
          <span class="mr-2 text-lg">🔒</span>
          <input
            v-model="password"
            type="password"
            placeholder="비밀번호 입력"
            class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
          />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="w-full flex items-center border border-gray-300 rounded-md px-3 py-2">
          <span class="mr-2 text-lg">🔒</span>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
          />
        </div>

        <!-- 버튼 -->
        <button
          @click="handleSubmit"
          class="w-full bg-[#3685F2] hover:bg-[#2c6fd6] text-white text-sm sm:text-base font-semibold py-2 rounded-md"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next'

const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const goBack = () => {
  router.back()
}

const handleSubmit = () => {
  if (!password.value || !confirmPassword.value) {
    alert('모든 칸을 입력해주세요.')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  // TODO: 비밀번호 조건 검사 & 백엔드 요청

  alert('비밀번호가 변경되었습니다.')
  router.push('/login')
}
</script>
