<template>
  <div class="bg-white min-h-screen px-6 py-8 flex flex-col items-center justify-center">
    <!-- 은행 로고 -->
    <img :src="selectedBankLogo" alt="은행 로고" class="w-16 h-16 mb-8" />

    <!-- 아이디 입력 -->
    <input
      v-model="email"
      type="email"
      placeholder="이메일을 입력해 주세요."
      class="w-full max-w-xs border-b border-gray-300 py-2 mb-4 text-sm focus:outline-none"
    />

    <!-- 비밀번호 입력 -->
    <input
      v-model="password"
      type="password"
      placeholder="비밀번호를 입력해 주세요."
      class="w-full max-w-xs border-b border-gray-300 py-2 mb-6 text-sm focus:outline-none"
    />

    <!-- 주의사항 -->
    <div class="w-full max-w-xs bg-[#FFF9EC] border border-[#F9DCA7] text-[#C87C00] rounded-md text-xs p-4 mb-6 space-y-1">
      <p class="font-medium">⚠️ 연결 시 주의사항</p>
      <ul class="list-disc list-inside space-y-1">
        <li>청약통장만 연결 가능합니다</li>
        <li>본인 명의 계좌만 연결할 수 있습니다</li>
        <li>연결 후 언제든지 해제할 수 있습니다</li>
      </ul>
    </div>

    <!-- 연결 버튼 -->
    <PrimaryButton class="w-full max-w-xs" @click="connectAccount">
      계좌 연결하기
    </PrimaryButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const accountStore = useAccountStore()

const email = ref('')
const password = ref('')

// 계좌 연결 시 다음 페이지로 이동
const connectAccount = () => {
  if (!email.value || !password.value) {
    alert('아이디와 비밀번호를 입력해주세요.')
    return
  }

  // TODO: 추후 백엔드 연동
  router.push('/bank/loading')
}

// 선택된 은행 로고 불러오기
const selectedBankLogo = accountStore.selectedBankLogo
</script>
