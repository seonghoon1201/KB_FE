<template>
  <div class="min-h-screen bg-white px-6 py-4 overflow-y-auto">
    <!-- 상단 헤더 -->
    <div class="flex items-center mb-6 relative w-full">
      <button @click="goBack" class="absolute left-0 text-black">
        <LucideArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-semibold text-center w-full">회원가입</h1>
    </div>

    <!-- 제목 -->
    <h2 class="text-2xl font-bold mb-6">반갑습니다!</h2>

    <!-- 폼 전체 -->
    <form class="flex flex-col gap-6 pb-10">
      <!-- 이메일 -->
      <div>
        <label class="text-base font-medium block mb-2">이메일</label>
        <div class="flex gap-2 items-end">
          <input
            v-model="email"
            type="email"
            placeholder="이메일을 입력해 주세요."
            class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
          />
          <PrimaryButton class="px-3 h-[36px] text-sm" @click.prevent="sendAuthCode">
            인증코드
          </PrimaryButton>
        </div>
      </div>

      <!-- 인증코드 입력 -->
      <div>
        <label class="text-base font-medium block mb-2">인증코드 입력</label>
        <div class="flex gap-2 items-end">
          <input
            v-model="code"
            type="text"
            placeholder="인증코드를 입력해 주세요."
            class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
          />
          <PrimaryButton class="px-3 h-[36px] text-sm" @click.prevent="verifyAuthCode">
            인증확인
          </PrimaryButton>
        </div>
      </div>

      <!-- 비밀번호 -->
      <div>
        <label class="text-base font-medium block mb-2">비밀번호</label>
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div>
        <label class="text-base font-medium block mb-2">비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요."
          class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
        />
      </div>

      <!-- 이름 -->
      <div>
        <label class="text-base font-medium block mb-2">이름</label>
        <input
          v-model="name"
          type="text"
          placeholder="이름을 입력해 주세요."
          class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
        />
      </div>

      <!-- 주소 -->
      <div>
        <label class="text-base font-medium block mb-2">주소</label>
        <div class="flex gap-2 items-center">
          <input
            v-model="address"
            type="text"
            placeholder="우편번호 및 주소를 입력해 주세요."
            class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
            readonly
          />
          <button type="button" @click="searchAddress">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 약관 -->
      <div class="text-base mt-2 space-y-3">
        <label class="flex items-center gap-2 font-medium">
          <input type="checkbox" v-model="agreeAll" @change="toggleAll" />
          모두 동의합니다
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="terms.service" />
          [필수] 이용약관 <span class="text-primary underline">[보기]</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="terms.privacy" />
          [필수] 개인정보 수집 및 이용 동의 <span class="text-primary underline">[보기]</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="terms.marketing" />
          [선택] 마케팅 정보 수신 동의
        </label>
      </div>

      <!-- 가입 버튼 -->
      <PrimaryButton
        class="mt-6 w-full h-[48px] text-base font-semibold"
        @click.prevent="submit"
      >
        지비 가입하기
      </PrimaryButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()

const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const address = ref('')

const agreeAll = ref(false)
const terms = ref({
  service: false,
  privacy: false,
  marketing: false,
})

const toggleAll = () => {
  const val = agreeAll.value
  terms.value.service = val
  terms.value.privacy = val
  terms.value.marketing = val
}

const goBack = () => {
  router.back()
}

const sendAuthCode = () => {
  console.log('인증코드 전송:', email.value)
}

const verifyAuthCode = () => {
  console.log('코드 인증 확인:', code.value)
}

const searchAddress = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      address.value = data.address
    },
  }).open()
}

const submit = () => {
  console.log('회원가입 정보', {
    email: email.value,
    password: password.value,
    name: name.value,
    address: address.value,
    terms: terms.value,
  })
}
</script>
