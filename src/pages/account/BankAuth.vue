<!-- BankAuth.vue -->
<template>
    <div class="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <!-- 은행 로고 -->
        <img v-if="logo" :src="logo" alt="은행 로고" class="w-20 h-20 object-contain mb-6" />

        <!-- 로딩 텍스트 -->
        <div class="flex flex-col items-center gap-2">
            <div
                class="w-5 h-5 border-2 border-gray-300 border-t-[#7B61FF] rounded-full animate-spin"
            ></div>
            <h2 class="text-lg font-bold text-gray-800 mt-2">계좌 연결 중…</h2>
            <p class="text-sm text-gray-500">{{ name }}과(와) 간편하게 연결하고 있어요</p>
        </div>

        <!-- 보안 문구 -->
        <div
            class="mt-10 px-4 py-3 rounded-md bg-[#F5F8FF] text-xs text-[#356AE6] font-medium text-center w-full max-w-xs"
        >
            🔒 256bit SSL 암호화로<br />
            안전하게 보호됩니다
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'

const router = useRouter()
const accountStore = useAccountStore()

const name = accountStore.selectedBankName
const logo = accountStore.selectedBankLogo

onMounted(() => {
    setTimeout(() => {
        router.push('/bank/complete')
    }, 3000)
})
</script>
