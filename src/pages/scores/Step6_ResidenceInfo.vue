<template>
    <ScoreStepWrapper>
        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">어느 지역에 언제부터 살고 계신가요?</h2>
            <InfoTooltip title="연속 거주지">
                <p>
                    해당 지역에 연속하여 1년 이상 거주한 경우, 특별공급 등의 조건에 유리할 수
                    있습니다.
                </p>
            </InfoTooltip>
        </div>
        <div class="space-y-4">
            <div class="flex gap-2">
                <select v-model="residence.city" class="border px-4 py-2 rounded w-1/2">
                    <option value="">시/도</option>
                    <option value="경기도">경기도</option>
                    <option value="서울특별시">서울특별시</option>
                </select>
                <select v-model="residence.district" class="border px-4 py-2 rounded w-1/2">
                    <option value="">시/군/구</option>
                    <option value="용인시">용인시</option>
                    <option value="강남구">강남구</option>
                </select>
            </div>
            <input
                v-model="residence.startDate"
                type="month"
                class="w-full border px-4 py-2 rounded"
                placeholder="거주 시작 연월"
            />
        </div>
        <PrimaryButton class="mt-8" @click="showModal = true">확인</PrimaryButton>

        <!-- 진단 완료 모달 -->
        <DiagnosisCompleteModal :visible="showModal" @close="handleModalClose" />
    </ScoreStepWrapper>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'

import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import DiagnosisCompleteModal from '@/components/modal/DiagnosisCompleteModal.vue'

const router = useRouter()
const scoreStore = useScoreStore()

const residence = scoreStore.residence
const showModal = ref(false)

const handleModalClose = () => {
    showModal.value = false
    router.push('/score/result')
}
</script>
