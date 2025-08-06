<!-- src/pages/score/Step1.vue -->
<template>
    <ScoreStepWrapper>
        <!-- 단계 표시 -->
        <div class="flex justify-start pb-4">
            <span class="text-lg text-gray-500">1/6</span>
        </div>

        <div class="flex items-center mb-6">
            <div>
                <h1 class="text-xl font-extrabold mb-1">주택 소유 기준</h1>
                <div class="flex items-center">
                    <h2 class="text-lg font-bold">현재 주택을 소유하고 있나요?</h2>
                    <InfoTooltip title="주택 소유 기준">
                        <ul class="text-base list-disc list-inside text-gray-600 space-y-2">
                            <li><strong>본인 및 세대원 전원</strong>이 주택 소유가 없어야 해요</li>
                            <li>
                                본인 또는 배우자의 직계존속 중 <strong>만 60세 이상</strong>이
                                소유한 주택(분양권 등 포함)은 <strong>주택 소유 X</strong>를
                                선택해주세요
                            </li>
                            <li>
                                <strong>오피스텔</strong>은 <strong>주택 소유 X</strong>를
                                선택해주세요
                            </li>
                            <li>
                                <strong>주택 분양권 또는 입주권</strong>은
                                <strong>주택 소유 O</strong>를 선택해주세요
                            </li>
                            <li>
                                5년 이내 갖고있던 분양권 혹은 주택을 처분한 적이 있으면 청약지원이
                                제한돼요
                            </li>
                        </ul>
                    </InfoTooltip>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <button @click="select('owner')" :class="btnClass('owner')">소유 중</button>
            <button @click="select('no-house')" :class="btnClass('no-house')">무주택</button>
        </div>

        <PrimaryButton class="mt-8" @click="next">다음</PrimaryButton>
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

// 초기 선택값 설정
const selected = ref(
    scoreStore.houseOwner === 1 ? 'owner' : scoreStore.houseOwner === 0 ? 'no-house' : '',
)

// 버튼 클릭 시 store 값 변경
function select(val) {
    selected.value = val
    scoreStore.houseOwner = val === 'owner' ? 1 : 0
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
    if (!selected.value) {
        alert('선택을 해주세요.')
        return
    }
    router.push('/score/step2')
}
</script>
