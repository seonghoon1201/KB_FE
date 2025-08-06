<template>
    <ScoreStepWrapper>
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">2/6 수정</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">주택 혹은 분양권을 처분한 적이 있나요?</h2>
            <InfoTooltip title="주택 및 분양권 처분 내역">
                <!-- …tooltip 내용… -->
            </InfoTooltip>
        </div>

        <div class="space-y-4">
            <button @click="select(1)" :class="btnClass(1)">네</button>
            <button @click="select(0)" :class="btnClass(0)">아니요</button>
        </div>

        <div v-if="selected === 1" class="mt-6">
            <label class="block mb-2 text-sm font-medium text-gray-700">처분한 연월</label>
            <input
                v-model="scoreStore.disposalDate"
                type="month"
                class="w-full border px-4 py-2 rounded-md"
            />
        </div>

        <p class="text-sm text-gray-500 mt-4">
            기억이 나지 않으면 대략 입력해주세요. 나중에 수정할 수 있어요.
        </p>

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

const selected = ref(
    scoreStore.houseDisposal !== null && scoreStore.houseDisposal !== undefined
        ? scoreStore.houseDisposal
        : '',
)

watchEffect(() => {
    if (
        scoreStore.houseDisposal !== null &&
        scoreStore.houseDisposal !== undefined &&
        scoreStore.houseDisposal !== selected.value
    ) {
        selected.value = scoreStore.houseDisposal
    }
})

function select(val) {
    selected.value = val
    scoreStore.houseDisposal = val
}

function btnClass(val) {
    return [
        'w-full px-4 py-3 rounded-md border font-semibold',
        val === selected.value
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 border-gray-300',
    ]
}

async function confirmEdit() {
    if (selected.value === '') return
    if (selected.value === 1 && !scoreStore.disposalDate) {
        alert('처분한 연월을 입력해주세요.')
        return
    }

    scoreStore.recomputeNoHousePeriodIfNeeded() // ✅ 먼저 무주택 기간 재계산
    scoreStore.saveToLocal() // ✅ 저장
    await scoreStore.calculateScore() // ✅ 서버에 요청

    router.push('/score/info')
}
</script>
