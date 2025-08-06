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
            <!-- "네" = 세대주 → 1, "아니요" = 세대원 → 0 -->
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

// 스토어 초기값(1|0|null)을 받아서 '' 또는 숫자로 셋업
const selected = ref(
    scoreStore.headOfHousehold !== null && scoreStore.headOfHousehold !== undefined
        ? scoreStore.headOfHousehold
        : '',
)

// 스토어 값이 바뀌면 컴포넌트에도 반영
watchEffect(() => {
    if (
        scoreStore.headOfHousehold !== null &&
        scoreStore.headOfHousehold !== undefined &&
        scoreStore.headOfHousehold !== selected.value
    ) {
        selected.value = scoreStore.headOfHousehold
    }
})

function select(val) {
    selected.value = val
    scoreStore.headOfHousehold = val
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
    if (selected.value === '') return
    router.push('/score/info')
}
</script>
