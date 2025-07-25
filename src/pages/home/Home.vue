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
             <RecommendSection
              :isPreferenceSet="isPreferenceSet"
              :recommendList="recommendList"
            />
        </main>
        <BottomNavbar />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useScoreStore } from '@/stores/score'
import { useAccountStore } from '@/stores/account'
import { useCommonStore } from '@/stores/common'

import MainHeader from '@/components/common/MainHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import AccountSection from '@/components/home/AccountSection.vue'
import ScoreSection from '@/components/home/ScoreSection.vue'
import RecommendSection from '@/components/home/RecommendSection.vue'

const commonStore = useCommonStore()
const scoreStore = useScoreStore()
const accountStore = useAccountStore()

const isScoreCalculated = computed(() => scoreStore.isCalculated)
const score = computed(() => scoreStore.score)

const isPreferenceSet = false
const recommendList = [
    { id: 1, name: '래미안 포레스트', location: '서울 강동구', image: 'apt1.jpg' },
    { id: 2, name: '자이 더 리버', location: '서울 마포구', image: 'apt2.jpg' },
    { id: 3, name: '힐스테이트 센트럴', location: '경기 성남시', image: 'apt3.jpg' },
]

const goToScoreInput = () => {
    router.push('/calculator')
}
</script>
