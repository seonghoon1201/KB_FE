<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">6/6 수정</span>
        </div>

        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">어느 지역에 언제부터 살고 계신가요?</h2>
            <InfoTooltip title="연속 거주지">
                <p>
                    해당 지역에 연속하여 1년 이상 거주한 경우, 특별공급 등의 조건에 유리할 수 있어요
                </p>
            </InfoTooltip>
        </div>

        <div class="space-y-4">
            <div class="flex gap-2">
                <select v-model="residence.city" class="border px-4 py-2 rounded w-1/2">
                    <option value="">시/도</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
                <select
                    v-model="residence.district"
                    class="border px-4 py-2 rounded w-1/2"
                    :disabled="!residence.city"
                >
                    <option value="">시/군/구</option>
                    <option v-for="d in districtsList" :key="d" :value="d">{{ d }}</option>
                </select>
            </div>

            <input
                v-model="residence.startDate"
                type="month"
                class="w-full border px-4 py-2 rounded"
            />
        </div>

        <PrimaryButton class="mt-8" @click="confirmEdit">확인</PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import { districts } from '@/data/districts'

const router = useRouter()
const scoreStore = useScoreStore()
const residence = scoreStore.residence

const cities = Object.keys(districts)
const districtsList = computed(() => (residence.city ? districts[residence.city] : []))

const confirmEdit = () => {
    router.push('/score/info')
}
</script>
