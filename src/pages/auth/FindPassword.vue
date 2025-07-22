<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center relative px-6">
    <!-- 뒤로가기 버튼 -->
    <button
      @click="goBack"
      class="absolute top-6 left-6 text-black"
      aria-label="뒤로가기"
    >
      <LucideArrowLeft class="w-6 h-6" />
    </button>

    <!-- 로고 -->
    <img
      src="@/assets/images/logo.png"
      alt="집을 구하는 지비 로고"
      class="w-full max-w-[240px] mb-8"
    />

    <!-- 설명 텍스트 -->
    <p class="text-sm text-gray-500 text-center mb-6">
      비밀번호를 찾고자 하는 이메일을 입력해주세요
    </p>

    <!-- 이메일 입력 -->
    <div class="w-full max-w-sm mb-6">
      <div class="flex items-center border border-gray-300 rounded-md px-3 py-2">
        <span class="mr-2 text-lg">📧</span>
        <input
          v-model="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          class="flex-1 text-sm placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>

    <!-- 다음 버튼 -->
    <button
      @click="handleNext"
      class="w-full max-w-sm bg-[#3685F2] hover:bg-[#2c6fd6] text-white text-sm font-semibold py-2 rounded-md"
    >
      다음
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next' // Lucide 아이콘 불러오기

const email = ref('')
const router = useRouter()

const handleNext = () => {
  if (!email.value) {
    alert('이메일을 입력해주세요.')
    return
  }

  // TODO: 이메일 유효성 검사 및 백엔드 연동
  router.push('/find-password/verify')
}

const goBack = () => {
  router.back()
}
</script>
