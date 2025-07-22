<template>
    <div class="bg-white min-h-screen px-4 py-6 flex flex-col pt-[70px] ">
        <BackHeader title="계좌 등록"/>

        <!-- 은행 리스트 -->
        <div class="grid grid-cols-3 gap-4">
            <div
                v-for="bank in banks"
                :key="bank.name"
                class="flex flex-col items-center space-y-1 cursor-pointer border rounded-md p-2 transition"
                :class="{
                    'border-[#7B61FF] bg-[#F5F2FD]': isSelected(bank),
                    'border-gray-200': !isSelected(bank),
                }"
                @click="selectBank(bank)"
            >
                <img :src="bank.logo" :alt="bank.name" class="w-12 h-12 object-contain" />
                <span
                    class="text-xs text-center"
                    :class="isSelected(bank) ? 'text-[#7B61FF] font-semibold' : 'text-gray-700'"
                >
                    {{ bank.name }}
                </span>
            </div>
        </div>

        <!-- 안내 박스 -->
        <div
            class="mt-8 px-4 py-3 rounded-md border border-[#F9DCA7] bg-[#FFF9EC] text-[13px] text-[#C87C00] space-y-1"
        >
            <p class="font-medium">⚠️ 연결 시 주의사항!</p>
            <p>・청약통장만 연결 가능합니다</p>
            <p>・본인 명의의 계좌만 연결할 수 있습니다</p>
            <p>・연결 후 언제든지 해제할 수 있습니다</p>
        </div>

        <!-- 연결 버튼 -->
        <PrimaryButton customClass="mt-6 w-full" @click="goNext"> 🛡 계좌 연결하기 </PrimaryButton>
    </div>
</template>

<script setup>
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import BackHeader from '@/components/common/BackHeader.vue'

const router = useRouter()
const accountStore = useAccountStore()

const banks = [
    {
        name: 'KB국민은행',
        code: '0004',
        logo: new URL('@/assets/images/KB.png', import.meta.url).href,
    },
    {
        name: '신한은행',
        code: '0088',
        logo: new URL('@/assets/images/Shinhan.png', import.meta.url).href,
    },
    {
        name: '제주은행',
        code: '0035',
        logo: new URL('@/assets/images/Shinhan.png', import.meta.url).href,
    },
    {
        name: '우리은행',
        code: '0020',
        logo: new URL('@/assets/images/Uri.png', import.meta.url).href,
    },
    {
        name: '기업은행',
        code: '0003',
        logo: new URL('@/assets/images/IBK.png', import.meta.url).href,
    },
    {
        name: 'SC제일은행',
        code: '0023',
        logo: new URL('@/assets/images/SC.png', import.meta.url).href,
    },
    {
        name: 'NH농협은행',
        code: '0011',
        logo: new URL('@/assets/images/NH.png', import.meta.url).href,
    },
    {
        name: 'SH수협은행',
        code: '0007',
        logo: new URL('@/assets/images/SH.png', import.meta.url).href,
    },
    {
        name: '하나은행',
        code: '0081',
        logo: new URL('@/assets/images/Hana.png', import.meta.url).href,
    },
    { name: 'IM뱅크', code: '0031', logo: new URL('@/assets/images/IM.png', import.meta.url).href },
    {
        name: '부산은행',
        code: '0032',
        logo: new URL('@/assets/images/BNK.png', import.meta.url).href,
    },
    {
        name: '경남은행',
        code: '0039',
        logo: new URL('@/assets/images/BNK.png', import.meta.url).href,
    },
    {
        name: '씨티은행',
        code: '0027',
        logo: new URL('@/assets/images/Citi.png', import.meta.url).href,
    },
    {
        name: '광주은행',
        code: '0034',
        logo: new URL('@/assets/images/KJ.png', import.meta.url).href,
    },
    {
        name: '전북은행',
        code: '0037',
        logo: new URL('@/assets/images/KJ.png', import.meta.url).href,
    },
]

// 선택된 은행 저장
const selectBank = (bank) => {
    accountStore.setSelectedBank(bank.name, bank.code, bank.logo)
}

// 선택 상태 체크
const isSelected = (bank) => {
    return accountStore.selectedBankCode === bank.code
}

// 다음 페이지 이동
const goNext = () => {
    if (!accountStore.selectedBankName) {
        alert('은행을 선택해주세요.')
        return
    }
    router.push('/bank/auth')
}
</script>
