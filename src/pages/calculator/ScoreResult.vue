<template>
    <div class="min-h-screen bg-white px-4 pt-16 pb-10">
        <BackHeader title="청약 가점 결과" />

        <div class="space-y-6">
            <!-- 총점 카드 -->
            <div class="bg-green-50 border border-green-200 rounded-xl p-6 shadow text-center">
                <h2 class="text-2xl font-bold text-green-700">총 가점</h2>
                <p class="text-4xl font-extrabold mt-2 text-black">
                    {{ scoreStore.total }}점 / 84점
                </p>
                <p class="text-sm mt-2 text-green-800 font-medium">{{ scoreStore.evaluation }}</p>
            </div>

            <!-- 세부 점수 카드 -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm text-center"
                >
                    <h3 class="text-sm font-semibold text-gray-600 mb-1">무주택 기간</h3>
                    <p class="text-xl font-bold text-indigo-700">{{ scoreStore.noHouse }}점</p>
                </div>
                <div
                    class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm text-center"
                >
                    <h3 class="text-sm font-semibold text-gray-600 mb-1">부양가족 수</h3>
                    <p class="text-xl font-bold text-indigo-700">{{ scoreStore.family }}점</p>
                </div>
                <div
                    class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm text-center"
                >
                    <h3 class="text-sm font-semibold text-gray-600 mb-1">청약통장</h3>
                    <p class="text-xl font-bold text-indigo-700">{{ scoreStore.account }}점</p>
                </div>
            </div>

            <!-- 버튼 -->
            <div class="grid grid-cols-2 gap-3 mt-6">
                <PrimaryButton class="w-full" @click="goHome">홈으로 돌아가기</PrimaryButton>
                <PrimaryButton class="w-full bg-[#A48BFF] text-white" @click="recalculate"
                    >다시 계산하기</PrimaryButton
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/score'
import { useUserStore } from '@/stores/user'
import { calculateAllScores } from '@/utils/scoreCalculator'

const router = useRouter()
const scoreStore = useScoreStore()
const userStore = useUserStore()

const goHome = () => {
    router.push('/')
}

const recalculate = () => {
    router.push('/no-house')
}

// ✅ 점수 계산 → 저장 → userStore에도 저장
const calculateScore = () => {
    const result = calculateAllScores(scoreStore.$state)
    scoreStore.setScores(result)
    userStore.saveScore({
        total: result.total,
        percent: Math.round((result.total / 84) * 1000) / 10,
        message: result.evaluation,
    })
}

// ✅ 컴포넌트 마운트 시 자동 계산 실행
onMounted(() => {
    calculateScore()
})
</script>
