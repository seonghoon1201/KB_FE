<template>
  <div class="min-h-screen bg-white px-4 sm:px-6 py-4 flex flex-col">
    <!-- 🔹 상단 고정 헤더 -->
    <div class="flex items-center mb-4">
      <button @click="goBack" aria-label="뒤로가기">
        <LucideArrowLeft class="w-6 h-6 text-black" />
      </button>
      <h1 class="text-base sm:text-lg font-semibold ml-2">비밀번호 찾기</h1>
    </div>

    <!-- 🔹 본문 내용 (중앙 + 살짝 위로 이동) -->
    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-md flex flex-col items-center gap-6 -translate-y-5">
        <!-- 로고 -->
        <img
          src="@/assets/images/logo.png"
          alt="지비 로고"
          class="w-full max-w-[200px] sm:max-w-[240px] mb-8"
        />

        <!-- 제목 -->
        <h2 class="text-xl font-bold text-center">인증 코드 입력</h2>

        <!-- 설명 -->
        <p class="text-sm sm:text-base text-gray-500 text-center leading-relaxed">
          입력하신 이메일 주소로 인증코드를 전송했습니다. <br />
          인증코드를 입력하여 본인 확인을 완료해주세요.
        </p>

        <!-- 입력 필드 -->
        <div class="w-full flex items-center border border-gray-300 rounded-md px-3 py-2">
          <span class="mr-2 text-lg">📩</span>
          <input
            v-model="code"
            type="text"
            placeholder="인증 코드를 입력해 주세요."
            class="flex-1 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
          />
        </div>

        <!-- 버튼 -->
        <button
          @click="handleNext"
          class="w-full bg-[#3685F2] hover:bg-[#2c6fd6] text-white text-sm sm:text-base font-semibold py-2 rounded-md"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next'

const code = ref('')
const router = useRouter()

const goBack = () => {
  router.back()
}

const handleNext = () => {
  if (!code.value) {
    alert('인증 코드를 입력해주세요.')
    return
  }

  router.push('/find/reset-password')
}
</script>
