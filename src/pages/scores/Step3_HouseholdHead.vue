<!-- src/pages/score/Step3.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">3/6</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">본인이 세대주이신가요?</h2>
            <InfoTooltip title="세대주 기준">
                <ul class="text-base list-disc list-inside text-gray-600 space-y-2">
                    <li>주민등록본상 가족 구성원의 대표를 세대주라고 해요</li>
                    <li>세대주를 제외한 구성원은 모두 세대원이에요</li>
                </ul>
            </InfoTooltip>
        </div>

        <div class="space-y-4">
            <button @click="select('yes')" :class="btnClass('yes')">네</button>
            <button @click="select('no')" :class="btnClass('no')">아니요</button>
        </div>

        <PrimaryButton class="mt-8" @click="next">다음</PrimaryButton>
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

const selected = ref(
    scoreStore.headOfHousehold === 1 ? 'yes' : scoreStore.headOfHousehold === 0 ? 'no' : '',
)

function select(val) {
    selected.value = val
    scoreStore.headOfHousehold = val === 'yes' ? 1 : 0
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

function next() {
    if (!selected.value) return
    router.push('/score/step4')
}
</script>
