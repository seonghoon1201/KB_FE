<template>
  <div class="min-h-screen bg-white px-4 pt-16 pb-10">
    <BackHeader title="STEP 2. 부양가족" />

    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
      <div class="h-full bg-indigo-500 transition-all duration-300" style="width: 66%;"></div>
    </div>

    <div class="space-y-6">
      <QuestionCard>
        <YesNoQuestion question="결혼하셨나요?" v-model="hasSpouse" />
      </QuestionCard>

      <QuestionCard v-if="hasSpouse !== null">
        <MultiSelectCheckbox
          label="같이 사는 가족 구성원을 선택해주세요"
          :options="['배우자', '부모/조부모', '자녀/손자녀']"
          v-model="familyTypes"
        />
      </QuestionCard>

      <QuestionCard v-if="familyTypes.length">
        <FamilyCountInput label="각 항목별 인원 수" v-model="familyCounts" />
      </QuestionCard>
    </div>

    <PrimaryButton
      class="w-full mt-10"
      v-if="showNextButton"
      @click="nextStep"
    >
      다음 단계로
    </PrimaryButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import YesNoQuestion from '@/components/common/YesNoQuestion.vue'
import MultiSelectCheckbox from '@/components/common/MultiSelectCheckbox.vue'
import FamilyCountInput from '@/components/common/FamilyCountInput.vue'
import QuestionCard from '@/components/common/QuestionCard.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useScoreStore } from '@/stores/score'

const hasSpouse = ref(null)
const familyTypes = ref([])
const familyCounts = ref({ spouse: 0, ascendant: 0, descendant: 0 })
const router = useRouter()
const scoreStore = useScoreStore()

const showNextButton = computed(() => {
  return hasSpouse.value !== null && familyTypes.value.length > 0
})

const nextStep = () => {
  scoreStore.setFamilyInfo({ hasSpouse: hasSpouse.value, familyTypes: familyTypes.value, familyCounts: familyCounts.value })
  router.push('/account')
}
</script>