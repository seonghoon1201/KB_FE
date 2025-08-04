<!-- src/pages/account/BankAuth.vue -->
<template>
    <div class="bg-white min-h-screen px-6 py-8 flex flex-col items-center justify-center">
        <!-- 은행 로고 -->
        <img :src="accountStore.selectedBankLogo" alt="은행 로고" class="w-16 h-16 mb-8" />

        <!-- 로그인 입력 폼 -->
        <form @submit.prevent="onLogin" class="w-full max-w-xs flex flex-col items-center">
            <!-- 아이디 입력 -->
            <input
                v-model="text"
                type="text"
                placeholder="아이디를 입력해 주세요."
                class="w-full border-b border-gray-300 py-2 mb-4 text-sm focus:outline-none"
            />

            <!-- 비밀번호 입력 -->
            <input
                v-model="password"
                type="password"
                placeholder="비밀번호를 입력해 주세요."
                class="w-full border-b border-gray-300 py-2 mb-6 text-sm focus:outline-none"
            />

            <!-- 주의사항 -->
            <div
                class="w-full bg-[#FFF9EC] border border-[#F9DCA7] text-[#C87C00] rounded-md text-xs p-4 mb-6 space-y-1"
            >
                <p class="font-medium">⚠️ 연결 시 주의사항</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>청약통장만 연결 가능합니다</li>
                    <li>본인 명의 계좌만 연결할 수 있습니다</li>
                    <li>연결 후 언제든지 해제할 수 있습니다</li>
                </ul>
            </div>

            <!-- 연결 버튼 -->
            <PrimaryButton type="submit" class="w-full">계좌 연결하기</PrimaryButton>
        </form>
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

function onLogin() {
    if (!email.value || !password.value) {
        return alert('아이디와 비밀번호를 입력해주세요.')
    }
    // 1) 즉시 로딩 페이지로
    router.push('/bank/loading')
    // 2) 백그라운드에서 연결 시도
    accountStore
        .connectAccount({
            id: email.value,
            organization: accountStore.selectedBankCode,
            bank_name: accountStore.selectedBankName,
            password: password.value,
        })
        .catch((e) => {
            console.error('연결 실패:', e)
            // 실패 시 다시 로그인 폼으로
            router.replace('/bank/auth')
            alert('계좌 연결에 실패했습니다.')
        })
}
</script>
