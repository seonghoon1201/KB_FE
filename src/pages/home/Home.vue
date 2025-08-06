<template>
    <div class="bg-white min-h-screen flex flex-col pt-[56px] pb-[60px]">
        <MainHeader />
        <main class="flex-1 px-4 py-6 space-y-6 overflow-y-auto" @click="commonStore.modalClose">
            <!-- 계좌 등록 파트 -->
            <AccountSection
                :hasAccount="accountStore.isRegistered"
                :bankName="accountStore.selectedBankName"
                :bankLogo="accountStore.selectedBankLogo"
                :accountNumber="accountStore.accountNumber"
                :depositRate="68"
            />
            <!-- 점수 계산 파트 -->
            <ScoreSection
                :isScoreCalculated="isScoreCalculated"
                :score="computedScore"
                @calculate="goToScoreInput"
                @recalculate="goToScoreInput"
            />
            <!-- 선호 설정 파트 -->
            <RecommendSection :isPreferenceSet="isPreferenceSet" :recommendList="recommendList" />
        </main>
        <BottomNavbar />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useCommonStore } from '@/stores/common'
import { usePreferenceStore } from '@/stores/preference'
import { useScoreStore } from '@/stores/scoreStore'

import MainHeader from '@/components/common/MainHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import AccountSection from '@/components/home/AccountSection.vue'
import ScoreSection from '@/components/home/ScoreSection.vue'
import RecommendSection from '@/components/home/RecommendSection.vue'

const commonStore = useCommonStore()
const accountStore = useAccountStore()
const userStore = useUserStore()

// scoreStore 에서 읽어옵니다
const scoreStore = useScoreStore()
const isScoreCalculated = computed(() => scoreStore.isCalculated)
const computedScore = computed(() => {
    const r = scoreStore.result // ← 여기엔 .value 가 없습니다
    const total = Number(r.total_ga_score || 0)
    const percent = total > 0 ? (total / 84) * 100 : 0
    const message = r.evaluation || ''
    return { total, percent, message }
})

const preferenceStore = usePreferenceStore()
const recommendList = [
    {
        id: 1,
        house_nm: '래미안 포레스트',
        city: '서울특별시',
        district: '강동구',
        application_start_date: '2025.08.20',
        application_end_date: '2025.09.10',
        application_period: '2025.08.20 ~ 2025.09.10',
        min_price: '97000',
        max_price: '187000',
        min_area: 86,
        max_area: 108,
        house_type: 'APT',
    },
    {
        id: 2,
        house_nm: '이편한세상 레이크뷰',
        city: '강원도',
        district: '춘천시',
        application_start_date: '2025.08.16',
        application_end_date: '2025.09.07',
        application_period: '2025.08.16 ~ 2025.09.07',
        min_price: '49000',
        max_price: '87000',
        min_area: 85,
        max_area: 109,
        house_type: 'APT',
    },
    {
        id: 2,
        house_nm: '군자 자이',
        city: '서울특별시',
        district: '광진구',
        application_start_date: '2025.08.24',
        application_end_date: '2025.09.01',
        application_period: '2025.08.24 ~ 2025.09.01',
        min_price: '42000',
        max_price: '71000',
        min_area: 68,
        max_area: 108,
        house_type: '오피스텔',
    },
]

const isPreferenceSet = computed(() => {
    return (
        preferenceStore.city !== '' &&
        preferenceStore.district !== '' &&
        preferenceStore.areas.length > 0 &&
        preferenceStore.priceRange[0] !== null &&
        preferenceStore.priceRange[1] !== null &&
        preferenceStore.types.length > 0
    )
})

const router = useRouter()
const goToScoreInput = () => {
    router.push('/score/step1')
}
</script>
