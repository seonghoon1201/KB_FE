<template>
    <div class="bg-white min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <!-- 체크 아이콘 -->
        <div
            class="w-[72px] h-[72px] mb-[24px] rounded-full bg-[#E7F0FF] flex items-center justify-center"
        >
            <CheckCircle class="w-[36px] h-[36px] text-[#356AE6]" />
        </div>

        <!-- 완료 텍스트 -->
        <h2 class="text-[18px] font-bold text-gray-800 mb-[6px]">계좌 연결 완료!</h2>
        <p class="text-[12px] text-gray-500 mb-[24px] leading-tight">
            {{ accountStore.selectedBankName }} 계좌와 안전하게 연결이 완료되었어요
        </p>

        <!-- 연결된 계좌 박스 -->
        <div
            class="flex items-center w-full max-w-[320px] px-[16px] py-[14px] mb-[24px] bg-[#F5F8FF] rounded-md border border-[#D6E4FF]"
        >
            <img
                :src="accountStore.selectedBankLogo"
                alt="은행 로고"
                class="w-[40px] h-[40px] object-contain mr-[12px]"
            />
            <div>
                <p class="text-[14px] font-semibold text-gray-800 leading-snug">
                    {{ accountStore.resAccountName }}
                </p>
                <p class="text-[12px] text-gray-500">
                    {{ accountStore.resAccount }}
                </p>
            </div>
        </div>

        <!-- 기능 설명 -->
        <ul class="text-[#356AE6] text-[13px] space-y-[10px] mb-[32px] w-full max-w-[320px]">
            <li class="flex items-start gap-[6px]">
                <Check class="w-[16px] h-[16px] mt-[2px]" />
                <span>실시간 잔액 확인 가능</span>
            </li>
            <li class="flex items-start gap-[6px]">
                <Check class="w-[16px] h-[16px] mt-[2px]" />
                <span>목표 달성을 자동 계산</span>
            </li>
            <li class="flex items-start gap-[6px]">
                <Check class="w-[16px] h-[16px] mt-[2px]" />
                <span>입출금 알림 설정</span>
            </li>
        </ul>

        <!-- 홈으로 돌아가기 버튼 -->
        <PrimaryButton
            customClass="w-full max-w-[320px] h-[44px] text-[14px] font-medium"
            @click="goHome"
        >
            홈으로 돌아가기
        </PrimaryButton>
    </div>
</template>

<script setup>
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { Check, CheckCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'

const router = useRouter()
const accountStore = useAccountStore()

const goHome = () => {
    router.push('/')
}
</script>
