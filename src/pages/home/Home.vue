<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- 본문 콘텐츠 -->
    <main class="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-20">
      <!-- 계좌 연결 또는 예치금 현황 -->
      <AccountSection :hasAccount="hasAccount" :depositRate="depositRate" />

      <!-- 내 가점 정보 -->
      <ScoreSection
        :isScoreCalculated="isScoreCalculated"
        :score="score"
        @calculate="goToScoreInput"
        @recalculate="goToScoreInput"
      />

      <!-- 맞춤형 청약 추천 -->
      <RecommendSection
        :isPreferenceSet="isPreferenceSet"
        :recommendList="recommendList"
      />
    </main>

    <!-- 바텀 네비게이션 -->
    <BottomNavbar />
  </div>
</template>

<script setup>
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import AccountSection from '@/components/home/AccountSection.vue'
import ScoreSection from '@/components/home/ScoreSection.vue'
import RecommendSection from '@/components/home/RecommendSection.vue'

import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useScoreStore } from '@/stores/score'

// ✅ Pinia 스토어 사용
const scoreStore = useScoreStore()
const isScoreCalculated = computed(() => scoreStore.isCalculated)
const score = computed(() => scoreStore.score)

// 임시 상태 (예치금 상태 및 추천)
const hasAccount = false
const depositRate = 68

const isPreferenceSet = true
const recommendList = isPreferenceSet
  ? [
      { id: 1, name: '래미안 포레스트', location: '서울 강동구', image: 'apt1.jpg' },
      { id: 2, name: '자이 더 리버', location: '서울 마포구', image: 'apt2.jpg' },
      { id: 3, name: '힐스테이트 센트럴', location: '경기 성남시', image: 'apt3.jpg' },
    ]
  : []

// 가점 계산 페이지 이동
const router = useRouter()
const goToScoreInput = () => {
  router.push('/calculator')
}
</script>
