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
                :score="score"
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

import MainHeader from '@/components/common/MainHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import AccountSection from '@/components/home/AccountSection.vue'
import ScoreSection from '@/components/home/ScoreSection.vue'
import RecommendSection from '@/components/home/RecommendSection.vue'

const commonStore = useCommonStore()
const accountStore = useAccountStore()
const userStore = useUserStore()

const isScoreCalculated = computed(() => !!userStore.score)
const score = computed(() => userStore.score ?? { total: 0, percent: 0, message: '' })

const preferenceStore = usePreferenceStore()
const recommendList = [
    { id: 1, name: '래미안 포레스트', location: '서울 강동구', image: 'apt1.jpg' },
    { id: 2, name: '자이 더 리버', location: '서울 마포구', image: 'apt2.jpg' },
    { id: 3, name: '힐스테이트 센트럴', location: '경기 성남시', image: 'apt3.jpg' },
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
    router.push('/score/no-house')
}
</script>
