<!-- src/pages/scores/Step6_ResidenceInfo.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">6/6</span>
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

        <PrimaryButton class="mt-8" :loading="loading" @click="onSubmit"> 확인 </PrimaryButton>
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

// EditStep6과 동일한 로컬 ref 사용
const localDate = ref(scoreStore.residenceStartDate)
const loading = ref(false)

// (선택) 입력값 변경 감지 로그
watch(localDate, (v) => console.log('[Step6] localDate →', v))

async function onSubmit() {
    // 1) 로컬 ref → store, localStorage 동기화
    console.log('[Step6] saving residenceStartDate=', localDate.value)
    scoreStore.residenceStartDate = localDate.value
    localStorage.setItem('residenceStartDate', localDate.value)

    // 2) 계산 호출
    loading.value = true
    try {
        await scoreStore.calculateScore()
        router.push('/score/result')
    } catch (e) {
        console.error('[Step6] calculateScore error', e)
        alert('가점 계산 중 오류가 발생했습니다.')
    } finally {
        loading.value = false
    }
}
</script>
