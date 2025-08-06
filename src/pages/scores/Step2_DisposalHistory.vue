<!-- src/pages/score/Step2.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">2/6</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">주택 혹은 분양권을 처분한 적이 있나요?</h2>
            <InfoTooltip title="주택 및 분양권 처분 내역">
                <p>
                    <strong>5년 이내</strong> 주택 또는 분양권을 처분한 이력이 있다면 불이익이 있을
                    수 있어요.
                </p>
            </InfoTooltip>
        </div>

        <div class="space-y-4">
            <button @click="select('yes')" :class="btnClass('yes')">네</button>
            <button @click="select('no')" :class="btnClass('no')">아니요</button>
        </div>

        <div v-if="selected.value === 'yes'" class="mt-6">
            <label class="block mb-2 text-sm font-medium text-gray-700">처분한 연월</label>
            <input
                v-model="disposedDate"
                type="month"
                class="w-full border px-4 py-2 rounded-md"
                placeholder="YYYY-MM"
            />
        </div>

        <p class="text-sm text-gray-500 mt-4">
            기억이 나지 않으면 대략 입력해주세요. 나중에 수정할 수 있어요.
        </p>
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
    scoreStore.houseDisposal === 1 ? 'yes' : scoreStore.houseDisposal === 0 ? 'no' : '',
)

const disposedDate = ref(scoreStore.disposalDate || '')

function select(val) {
    selected.value = val
    scoreStore.houseDisposal = val === 'yes' ? 1 : 0

    if (val === 'no') {
        disposedDate.value = ''
        scoreStore.disposalDate = ''
    }
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

    if (selected.value === 'yes') {
        if (!disposedDate.value) {
            alert('처분한 연월을 입력해주세요.')
            return
        }
        scoreStore.disposalDate = disposedDate.value
    } else {
        scoreStore.disposalDate = null
    }
    scoreStore.saveToLocal()

    router.push('/score/step3')
}
</script>
