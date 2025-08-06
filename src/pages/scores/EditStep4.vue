<!-- src/pages/scores/EditStep4_MaritalStatus.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">4/6 수정</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">혼인 하셨나요?</h2>
            <InfoTooltip title="혼인 여부">
                <p>혼인 여부는 서류상 기준이며, 사실혼도 인정받을 수 있어요.</p>
            </InfoTooltip>
        </div>

        <div class="space-y-4">
            <button @click="select(1)" :class="btnClass(1)">네</button>
            <button @click="select(0)" :class="btnClass(0)">아니요</button>
        </div>

        <div v-if="selected === 1" class="mt-6">
            <label class="block mb-2 text-sm font-medium text-gray-700">혼인 신고 연월</label>
            <input
                v-model="weddingDate"
                type="month"
                class="w-full border px-4 py-2 rounded-md"
                placeholder="YYYY-MM"
            />
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

// 초기값: store값이 있을 땐 그 값을, 없으면 빈 문자열
const selected = ref(scoreStore.maritalStatus ?? '')
const weddingDate = ref(scoreStore.weddingDate ?? '')

// store.maritalStatus가 외부에서 바뀌면 selected만 동기화
watchEffect(() => {
    if (
        scoreStore.maritalStatus !== null &&
        scoreStore.maritalStatus !== undefined &&
        scoreStore.maritalStatus !== selected.value
    ) {
        selected.value = scoreStore.maritalStatus
    }
})

// 날짜는 사용자 입력을 덮어쓰지 않도록, watchEffect에서 제거!

function select(val) {
    selected.value = val
    scoreStore.maritalStatus = val
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
    if (selected.value === 1 && !weddingDate.value) {
        alert('혼인 신고 연월을 입력해주세요.')
        return
    }

    scoreStore.weddingDate = weddingDate.value
    scoreStore.saveToLocal() // ✅ 로컬 저장
    await scoreStore.calculateScore() // ✅ 점수 재계산

    router.push('/score/info')
}
</script>
