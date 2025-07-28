<template>
    <div class="min-h-screen bg-white px-4 pt-16 pb-10">
        <BackHeader title="STEP 1. 무주택 여부" />

        <!-- 진행률 -->
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div class="h-full bg-indigo-500 transition-all duration-300" style="width: 33%"></div>
        </div>

        <div class="space-y-6">
            <QuestionCard>
                <YesNoQuestion question="현재 주택을 소유하고 계신가요?" v-model="ownHouse" />
            </QuestionCard>

            <QuestionCard v-if="ownHouse === false">
                <YesNoQuestion
                    question="세대원 중 주택 소유자가 있나요?"
                    v-model="familyOwnHouse"
                />
            </QuestionCard>

            <QuestionCard v-if="ownHouse === false && familyOwnHouse === false">
                <NumberInput label="현재 나이를 입력해주세요" v-model="age" />
            </QuestionCard>

            <QuestionCard v-if="ownHouse === false && familyOwnHouse === false && age">
                <YesNoQuestion question="결혼하셨나요?" v-model="isMarried" />
            </QuestionCard>

            <QuestionCard
                v-if="ownHouse === false && familyOwnHouse === false && age && isMarried !== null"
            >
                <DatePickerQuestion
                    label="무주택이 된 시점을 선택해주세요"
                    v-model="noHouseStartDate"
                />
            </QuestionCard>
        </div>

        <PrimaryButton class="w-full mt-10" v-if="showNextButton" @click="nextStep">
            다음 단계로
        </PrimaryButton>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import YesNoQuestion from '@/components/common/YesNoQuestion.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import DatePickerQuestion from '@/components/common/DatePickerQuestion.vue'
import QuestionCard from '@/components/common/QuestionCard.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useScoreStore } from '@/stores/score'

const ownHouse = ref(null)
const familyOwnHouse = ref(null)
const age = ref(null)
const isMarried = ref(null)
const noHouseStartDate = ref(null)
const router = useRouter()
const scoreStore = useScoreStore()

// 유효성 검증
const isEligible = computed(() => ownHouse.value === false && familyOwnHouse.value === false)

const showNextButton = computed(() => {
    if (ownHouse.value === true || familyOwnHouse.value === true) return true
    return (
        ownHouse.value === false &&
        familyOwnHouse.value === false &&
        age.value &&
        isMarried.value !== null &&
        noHouseStartDate.value
    )
})

watchEffect(() => {
    if (ownHouse.value === true || familyOwnHouse.value === true) {
        // 주택 소유자이면 바로 다음 단계로
        nextStep()
    }
})

const nextStep = () => {
    scoreStore.setNoHouseInfo({
        ownHouse: ownHouse.value,
        familyOwnHouse: familyOwnHouse.value,
        age: age.value,
        isMarried: isMarried.value,
        noHouseStartDate: noHouseStartDate.value,
    })
    router.push('/family')
}
</script>
