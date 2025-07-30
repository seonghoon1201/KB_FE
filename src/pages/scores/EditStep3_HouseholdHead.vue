<!-- src/pages/scores/EditStep3_HouseholdHead.vue -->
<template>
    <ScoreStepWrapper>
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">3/6 수정</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">본인이 세대주이신가요?</h2>
            <InfoTooltip title="세대주 기준">
                <!-- …tooltip 내용… -->
            </InfoTooltip>
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

const selected = ref(scoreStore.isHouseholdHead || '')

const select = (val) => {
    selected.value = val
    scoreStore.isHouseholdHead = val
}

const btnClass = (val) => [
    'w-full px-4 py-3 rounded-md border font-semibold',
    val === selected.value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300',
]

const confirmEdit = () => {
    if (!selected.value) return
    router.push('/score/info')
}
</script>
