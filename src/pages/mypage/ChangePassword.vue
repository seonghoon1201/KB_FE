<template>
    <div class="flex flex-col items-center min-h-screen bg-white text-center px-6">
        <BackHeader title="비밀번호 변경" />

        <form @submit.prevent="savePassword" class="m-4 p-2 mt-16 w-full">
            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">현재 비밀번호</label>
                <input
                    type="text"
                    v-model='currentPassword'
                    class="w-full border rounded-[8px] px-3 py-2"
                    placeholder="현재 비밀번호 입력"
                />
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">새 비밀번호</label>
                <input
                    type="password"
                    v-model="newPassword"
                    class="w-full border rounded-[8px] px-3 py-2"
                    placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
                />
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">비밀번호 확인</label>
                <input
                    type="password"
                    v-model="confirmPassword"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <PrimaryButton>완료</PrimaryButton>
        </form>
    </div>
</template>
<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { ref } from 'vue'

const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')



const savePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('모든 항목을 입력해주세요.')
    return
  }

  // 비밀번호 유효성 체크: 8자리 이상, 영문+숫자+특수문자 포함
  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  if (!pwRegex.test(newPassword.value)) {
    alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
    return
  }

  // TODO: 실제 비밀번호 변경 API 호출
  alert('비밀번호가 성공적으로 변경되었습니다!')
  navigateTo('/mypage')
}

const navigateTo = (path) => {
    router.push(path)
}
</script>
