<!-- src/pages/scores/EditStep1_HouseOwnership.vue -->
<template>
    <ScoreStepWrapper>
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">1/6 수정</span>
        </div>

        <div class="flex items-center mb-6">
            <div>
                <h1 class="text-xl font-extrabold mb-1">주택 소유 기준</h1>
                <div class="flex items-center">
                    <h2 class="text-lg font-bold">현재 주택을 소유하고 있나요?</h2>
                    <InfoTooltip title="주택 소유 기준">
                        <!-- ...tooltip 내용... -->
                    </InfoTooltip>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <button @click="select('no')" :class="btnClass('no')">네</button>
            <button @click="select('yes')" :class="btnClass('yes')">아니요</button>
        </div>

        <PrimaryButton class="mt-8" @click="confirmEdit">확인</PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const scoreStore = useScoreStore()

const selected = ref(scoreStore.houseOwned || '')

const select = (val) => {
    selected.value = val
    scoreStore.houseOwned = val // 로컬 스토어만 업데이트
}

const btnClass = (val) => [
    'w-full px-4 py-3 rounded-md border font-semibold',
    val === selected.value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300',
]

const confirmEdit = () => {
    // API 호출 없음! 그냥 정보 확인 화면으로 돌아갑니다.
    router.push('/score/info')
}
</script>
