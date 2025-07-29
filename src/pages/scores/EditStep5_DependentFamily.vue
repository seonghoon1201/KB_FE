<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">5/6 수정</span>
        </div>

        <div class="px-4 pb-4">
            <h2 class="text-xl font-bold">부양가족을 선택해주세요</h2>
            <p class="text-sm text-gray-500 mt-1">
                청약 점수 계산에 가장 중요한 정보예요. 부양가족 설명을 참고해주세요
            </p>
        </div>

        <ul class="divide-y divide-gray-200">
            <!-- 배우자 -->
            <li class="flex justify-between items-center py-4 px-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="font-medium">배우자</span>
                        <InfoTooltip title="배우자 부양가족 기준">
                            <ul class="list-disc list-inside text-base text-gray-600 space-y-2">
                                <li>
                                    배우자가 나와 세대가 분리되어 있어도 무주택 상태라면 부양가족에
                                    포함돼요
                                </li>
                                <li>2주택 이상 소유 시 소유 주택 수마다 5점 감점</li>
                            </ul>
                        </InfoTooltip>
                    </div>
                    <span class="text-sm text-gray-500 mt-1">무주택</span>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="dependents.spouse = 1"
                        :class="[
                            'w-10 h-8 rounded-full border font-medium',
                            dependents.spouse === 1
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-gray-100 text-gray-700 border-gray-200',
                        ]"
                    >
                        O
                    </button>
                    <button
                        @click="dependents.spouse = 0"
                        :class="[
                            'w-10 h-8 rounded-full border font-medium',
                            dependents.spouse === 0
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-gray-100 text-gray-700 border-gray-200',
                        ]"
                    >
                        X
                    </button>
                </div>
            </li>

            <!-- 무주택 부모 -->
            <li class="flex justify-between items-center py-4 px-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="font-medium">무주택 부모</span>
                        <InfoTooltip title="부모 부양가족 기준">
                            <ul class="list-disc list-inside text-base text-gray-600 space-y-2">
                                <li>본인/배우자 부모 모두 무주택, 3년 이상 등재 시 인정</li>
                                <li>만 60세 이상은 유주택도 인정, 2주택 초과 시 5점 감점</li>
                            </ul>
                        </InfoTooltip>
                    </div>
                    <span class="text-sm text-gray-500 mt-1">만 60세 이상이면 유주택도 가능</span>
                </div>
                <DependentCounter v-model="dependents.parents" />
            </li>

            <!-- 자녀 -->
            <li class="flex justify-between items-center py-4 px-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="font-medium">자녀</span>
                        <InfoTooltip title="자녀 부양가족 기준">
                            <ul class="list-disc list-inside text-base text-gray-600 space-y-2">
                                <li>만 30세 미만 미혼 자녀는 자동 인정</li>
                                <li>2주택 이상 보유 시 주택 수마다 5점 감점</li>
                            </ul>
                        </InfoTooltip>
                    </div>
                    <span class="text-sm text-gray-500 mt-1">무주택 / 미혼자</span>
                </div>
                <DependentCounter v-model="dependents.children" />
            </li>
        </ul>

        <PrimaryButton class="mt-8 mx-4" @click="confirmEdit">확인</PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import DependentCounter from '@/components/score/DependentCounter.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'

const router = useRouter()
const scoreStore = useScoreStore()
const dependents = scoreStore.dependents

const confirmEdit = () => {
    router.push('/score/info')
}
</script>
