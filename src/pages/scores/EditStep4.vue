<template>
  <ScoreStepWrapper>
    <!-- 단계 표시 -->
    <div class="flex justify-start pb-4">
      <span class="text-lg text-gray-500">4/6 수정</span>
    </div>

    <div class="flex items-center mb-6">
      <h2 class="text-lg font-bold">혼인 하셨나요?</h2>
      <InfoTooltip title="혼인 여부">
        <p>혼인 여부는 서류상 기준이며, 사실혼도 인정받을 수 있어요.</p>
      </InfoTooltip>
    </div>

    <div class="space-y-4">
      <button @click="select('yes')" :class="btnClass('yes')">네</button>
      <button @click="select('no')"  :class="btnClass('no')">아니요</button>
    </div>

    <div v-if="selected === 'yes'" class="mt-6">
      <label class="block mb-2 text-sm font-medium text-gray-700">혼인 신고 연월</label>
      <input
        v-model="marriageDate"
        type="month"
        class="w-full border px-4 py-2 rounded-md"
      />
    </div>

    <PrimaryButton class="mt-8" @click="confirmEdit">확인</PrimaryButton>
  </ScoreStepWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import ScoreStepWrapper from '@/components/score/ScoreStepWrapper.vue'
import InfoTooltip from '@/components/score/InfoTooltip.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const scoreStore = useScoreStore()

// 초기값
const selected = ref(scoreStore.isMarried || '')
const marriageDate = ref(scoreStore.marriageDate || '')

const select = (val) => {
  selected.value = val
  scoreStore.isMarried = val
}

const btnClass = (val) => [
  'w-full px-4 py-3 rounded-md border font-semibold',
  val === selected.value
    ? 'bg-blue-500 text-white'
    : 'bg-white text-gray-700 border-gray-300',
]

const confirmEdit = () => {
  if (!selected.value) return
  if (selected.value === 'yes' && !marriageDate.value) {
    alert('혼인 신고 연월을 입력해주세요.')
    return
  }
  scoreStore.marriageDate = marriageDate.value
  router.push('/score/info')
}
</script>
