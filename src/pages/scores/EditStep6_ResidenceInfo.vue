<!-- src/pages/scores/EditStep6_ResidenceInfo.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">6/6 수정</span>
        </div>

        <!-- 헤드라인 -->
        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">현재 주소지에 언제부터 살고 계신가요?</h2>
            <InfoTooltip title="연속 거주지">
                <p>
                    해당 지역에 연속하여 1년 이상 거주한 경우, 특별공급 등의 조건에 유리할 수 있어요
                </p>
            </InfoTooltip>
        </div>

        <!-- 입력 부분 -->
        <div class="space-y-4">
            <input
                v-model="localDate"
                type="month"
                class="w-full border px-4 py-2 rounded"
                placeholder="거주 시작 연월"
            />
        </div>

        <PrimaryButton class="mt-8" :loading="loading" @click="confirmEdit"> 확인 </PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const scoreStore = useScoreStore()

// 1) Edit 전용 로컬 ref
const localDate = ref(scoreStore.residenceStartDate)
const loading = ref(false)

async function confirmEdit() {
    scoreStore.residenceStartDate = localDate.value
    scoreStore.saveToLocal() // ✅ 공식 메서드로 로컬 저장

    loading.value = true
    try {
        await scoreStore.calculateScore()
        router.push('/score/info')
    } catch (err) {
        console.error('[EditStep6] calculateScore error', err)
    } finally {
        loading.value = false
    }
}
</script>
