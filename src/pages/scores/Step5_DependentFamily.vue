<template>
    <ScoreStepWrapper>
        <div class="flex items-center mb-6">
            <h2 class="text-lg font-bold">부양가족을 선택해주세요</h2>
        </div>

        <!-- 배우자 -->
        <div class="flex items-center gap-2 mb-6">
            <DependentCounter label="배우자" v-model="dependents.spouse" info="무주택" />
            <InfoTooltip title="배우자 부양가족 기준">
                <ul class="list-disc list-inside text-base">
                    <li>
                        배우자가 나와 세대가 분리되어 있어도 무주택 상태라면 배우자를 포함한 그
                        세대원도 부양가족에 포함돼요
                    </li>
                    <li>
                        부양가족인 배우자(본인 포함)가 2주택 이상을 소유한 경우, 소유 주택 수마다
                        5점씩 감점돼요<br />ex) 2주택 소유 : 10점 감점
                    </li>
                </ul>
            </InfoTooltip>
        </div>

        <!-- 부모 -->
        <div class="flex items-center gap-2 mb-6">
            <DependentCounter
                label="무주택 부모"
                v-model="dependents.parents"
                info="60세 이상 가능"
            />
            <InfoTooltip title="부모 부양가족 기준">
                <ul class="list-disc list-inside text-base">
                    <li>
                        본인 / 배우자의 부모님은 모두 무주택이어야해요. 또한 주민등록등본에 최근 3년
                        이상 등재되어 있어야 인정돼요. 부모님이 만 60세 이상이면 주택을 소유했어도
                        무주택 부양가족으로 인정돼요
                    </li>
                    <li>
                        만 60세 이상 부모가 2주택 이상을 소유한 경우, 1주택 초과 주택마다 5점씩
                        감점돼요 <br />
                        ex) 2주택 소유 : 5점 감점
                    </li>
                </ul>
            </InfoTooltip>
        </div>

        <!-- 자녀 -->
        <div class="flex items-center gap-2 mb-6">
            <DependentCounter label="자녀" v-model="dependents.children" info="미혼, 무주택" />
            <InfoTooltip title="자녀 부양가족 기준">
                <ul class="list-disc list-inside text-base">
                    <li>
                        만 30세 미만의 미혼 자녀는 부양가족으로 인정돼요. 만 30세 이상의 미혼 자녀는
                        주민등록등본에 최근 1년 이상 등재되어 있어야 인정돼요
                    </li>
                    <li>
                        부양가족인 자녀가 2주택 이상을 소유한 경우, 소유주택 수 마다 5점씩 감점돼요
                        <br />ex) 2주택 소유 : 10점 감점
                    </li>
                </ul>
            </InfoTooltip>
        </div>

        <PrimaryButton class="mt-8" @click="next">다음</PrimaryButton>
    </ScoreStepWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import DependentCounter from '@/components/score/DependentCounter.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'

const router = useRouter()
const scoreStore = useScoreStore()

const dependents = scoreStore.dependents

const next = () => {
    router.push('/score/step6')
}
</script>
