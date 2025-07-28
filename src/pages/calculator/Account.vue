<template>
    <div class="min-h-screen bg-white px-4 pt-16 pb-10">
        <BackHeader title="STEP 3. 청약통장" />

        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div class="h-full bg-indigo-500 transition-all duration-300" style="width: 100%"></div>
        </div>

        <div class="space-y-6">
            <QuestionCard>
                <YesNoQuestion question="청약통장을 보유하고 계신가요?" v-model="hasAccount" />
            </QuestionCard>

            <QuestionCard v-if="hasAccount">
                <DatePickerQuestion
                    label="청약통장 가입일을 선택해주세요"
                    v-model="accountStartDate"
                />
            </QuestionCard>

            <QuestionCard v-if="hasAccount && accountStartDate">
                <NumberInput
                    label="지금까지 몇 번 납입하셨나요? (최대 102회)"
                    v-model="depositCount"
                />
            </QuestionCard>
        </div>

        <PrimaryButton class="w-full mt-10" v-if="showNextButton" @click="calculateScore">
            가점 계산하기
        </PrimaryButton>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import YesNoQuestion from '@/components/common/YesNoQuestion.vue'
import DatePickerQuestion from '@/components/common/DatePickerQuestion.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import QuestionCard from '@/components/common/QuestionCard.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useScoreStore } from '@/stores/score'
import { calculateAllScores } from '@/utils/scoreCalculator'

const hasAccount = ref(null)
const accountStartDate = ref(null)
const depositCount = ref(null)
const router = useRouter()
const scoreStore = useScoreStore()

const showNextButton = computed(() => {
    return hasAccount.value && accountStartDate.value && depositCount.value !== null
})

const calculateScore = () => {
    scoreStore.setAccountInfo({
        hasAccount: hasAccount.value,
        accountStartDate: accountStartDate.value,
        depositCount: depositCount.value,
    })
    scoreStore.setScores(calculateAllScores(scoreStore.$state))
    router.push('/score-result')
}
</script>
