<template>
  <div class="h-screen w-screen bg-white flex items-center justify-center px-6">
    <!-- 중앙 콘텐츠 묶음 -->
    <div class="w-full max-w-[328px] flex flex-col items-center gap-6">
      <!-- 로고 -->
      <img
        src="@/assets/images/logo.png"
        alt="지비 로고"
        class="w-full max-w-[280px] sm:max-w-[300px]"
      />

      <!-- 입력칸 -->
      <div class="w-full flex flex-col gap-4">
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
      </div>

      <!-- 버튼 -->
      <div class="w-full flex flex-col gap-3">
        <PrimaryButton
          class="w-full h-[44px] bg-[#4EA1FF] text-white rounded-[8px] border-none shadow-none text-sm font-semibold"
          @click="handleLogin"
        >
          로그인
        </PrimaryButton>

        <button
          @click="handleKakaoLogin"
          class="w-full h-[44px] bg-[#FEE500] text-black text-sm font-medium rounded-[8px] flex items-center justify-center gap-1"
        >
          <img
            src="@/assets/images/kakao-icon.png"
            alt="카카오"
            class="w-[16px] h-[16px]"
          />
          카카오로 이용하기
        </button>
      </div>

      <!-- 하단 링크 -->
      <div class="text-[12px] text-[#7E7E7E] flex justify-center gap-6 w-full">
        <span class="cursor-pointer hover:underline" @click="goToFindPassword">비밀번호 찾기</span>
        <span class="text-[#D9D9D9]">|</span>
        <span class="cursor-pointer hover:underline" @click="goToSignUp">회원가입</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const email = ref('')
const password = ref('')
const router = useRouter()

function handleLogin() {
  console.log('로그인 시도:', email.value, password.value)
}

function handleKakaoLogin() {
  console.log('카카오 로그인')
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
