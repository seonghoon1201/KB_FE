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
                        <!-- tooltip 내용... -->
                    </InfoTooltip>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <button @click="select(1)" :class="btnClass(1)">네</button>
            <button @click="select(0)" :class="btnClass(0)">아니요</button>
        </div>

        <PrimaryButton class="mt-8" @click="confirmEdit">확인</PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const scoreStore = useScoreStore()

// 스토어에 저장된 값을 초기화 (null이면 빈문자열)
const selected = ref(scoreStore.houseOwner != null ? scoreStore.houseOwner : '')

// 스토어 값이 외부에서 바뀔 때도 selected 동기화
watchEffect(() => {
    if (scoreStore.houseOwner != null && scoreStore.houseOwner !== selected.value) {
        selected.value = scoreStore.houseOwner
    }
})

function select(val) {
    selected.value = val
    scoreStore.houseOwner = val
    scoreStore.saveToLocal()
}

function btnClass(val) {
    return [
        'w-full px-4 py-3 rounded-md border font-semibold',
        val === selected.value
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 border-gray-300',
    ]
}

function confirmEdit() {
    router.push('/score/info')
}
</script>
