<template>
    <div class="bg-white min-h-screen px-4 py-6 space-y-6 pt-[56px]">
        <BackHeader title="청약 가점 계산기" />
        <!-- 상단 설명 박스 -->
        <div class="bg-[#F5F2FD] p-4 rounded-lg text-center space-y-1">
            <h1 class="text-base font-semibold text-indigo-600">📊 청약 가점 계산기</h1>
            <p class="text-xs text-gray-600">
                청약 가점은 무주택 기간, 부양가족 수, 청약통장 가입기간으로 계산됩니다.
            </p>
        </div>

        <!-- 무주택 기간 -->
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-medium text-gray-800 flex items-center gap-1">
                1. 무주택 기간 (최대 32점)
                <Info class="w-4 h-4 text-gray-500 cursor-pointer" @click="showInfo(1)" />
            </label>
            <Dropdown v-model="noHouse" :options="noHouseOptions" />
            <p class="text-xs text-indigo-600">무주택 기간 점수: {{ noHouseScore }}점</p>
        </div>

        <!-- 부양가족 -->
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-medium text-gray-800 flex items-center gap-1">
                2. 부양가족 수 (최대 35점)
                <Info class="w-4 h-4 text-gray-500 cursor-pointer" @click="showInfo(2)" />
            </label>
            <p class="text-xs text-gray-500">
                본인 제외한 배우자, 직계존속(부모/조부모), 직계비속(자녀/손자녀) 인원을 선택하세요.
            </p>

            <div class="flex items-center gap-4">
                <label class="flex items-center gap-1">
                    <input type="radio" v-model="hasSpouse" :value="true" />
                    <span class="text-sm">배우자 있음</span>
                </label>
                <label class="flex items-center gap-1">
                    <input type="radio" v-model="hasSpouse" :value="false" />
                    <span class="text-sm">배우자 없음</span>
                </label>
            </div>

            <Dropdown
                v-model="myAscendants"
                label="본인의 직계존속 (부모/조부모)"
                :options="peopleOptions"
            />
            <Dropdown
                v-if="hasSpouse"
                v-model="spouseAscendants"
                label="배우자의 직계존속 (부모/조부모)"
                :options="peopleOptions"
            />
            <Dropdown
                v-model="descendants"
                label="미혼 직계비속 (자녀/손자녀)"
                :options="peopleOptions"
            />

            <p class="text-xs text-indigo-600">부양가족 점수: {{ familyScore }}점</p>
        </div>

        <!-- 청약통장 가입기간 -->
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-medium text-gray-800 flex items-center gap-1">
                3. 청약통장 가입기간 (최대 17점)
                <Info class="w-4 h-4 text-gray-500 cursor-pointer" @click="showInfo(3)" />
            </label>
            <Dropdown v-model="accountPeriod" :options="accountOptions" />

            <!-- 경고 문구 추가 -->
            <p class="text-xs text-red-500 leading-snug">
                ※ 실제로 <span class="font-semibold">입금이 완료된 기간</span>만 인정됩니다.<br />
                납입 없이 보유만 한 기간은 가점 산정에 포함되지 않아요.
            </p>

            <p class="text-xs text-indigo-600">청약통장 점수: {{ accountScore }}점</p>
        </div>

        <!-- 계산 버튼 -->
        <PrimaryButton customClass="mt-6 w-full" @click="calculateScore">
            가점 계산하기
        </PrimaryButton>

        <!-- 계산 결과 -->
        <div
            v-if="isCalculated"
            class="bg-[#F0F9ED] mt-6 p-4 rounded-xl text-sm text-gray-800 space-y-2 border border-[#D5E7D0]"
        >
            <h2 class="text-base font-bold text-green-700 mb-2">📋 계산 결과</h2>
            <p>
                무주택 기간: <span class="font-semibold">{{ noHouseScore }}점</span>
            </p>
            <p>
                부양가족 수: <span class="font-semibold">{{ familyScore }}점</span>
            </p>
            <p>
                청약통장 가입기간: <span class="font-semibold">{{ accountScore }}점</span>
            </p>
            <hr />
            <p class="font-bold text-lg">총 가점: {{ totalScore }}점 / 84점</p>
            <p class="text-sm font-medium text-green-800">
                가점 평가: {{ evaluateScore(totalScore) }}
            </p>

            <!-- 버튼 2개 -->
            <div class="grid grid-cols-2 gap-2 mt-4">
                <PrimaryButton customClass="text-white" @click="goHome">
                    홈으로 돌아가기
                </PrimaryButton>
                <PrimaryButton customClass="bg-[#A48BFF] text-white" @click="reset">
                    다시 계산하기
                </PrimaryButton>
            </div>
        </div>

        <!-- 설명 모달 -->
        <Modal
            :visible="modalVisible"
            :title="modalTitle"
            :message="modalContent"
            @close="modalVisible = false"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Dropdown from '@/components/common/Dropdown.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import Modal from '@/components/modal/InfoModal.vue'
import { Info } from 'lucide-vue-next'
import { useScoreStore } from '@/stores/score'
import BackHeader from '@/components/common/BackHeader.vue'

const scoreStore = useScoreStore()
const noHouse = ref('')
const accountPeriod = ref('')
const hasSpouse = ref(null)
const myAscendants = ref(0)
const spouseAscendants = ref(0)
const descendants = ref(0)
const isCalculated = ref(false)
const modalVisible = ref(false)
const modalContent = ref('')
const modalTitle = ref('')

const showInfo = (type) => {
    modalVisible.value = true
    if (type === 1) {
        modalTitle.value = '무주택 기간이란?'
        modalContent.value = `무주택 기간은 청약 신청자와 세대 구성원이 모두 주택을 소유하지 않은 기간을 의미합니다.

- 30세 이상 또는 혼인한 시점 중 빠른 시점부터 무주택 기간으로 계산됩니다.
- 기존에 주택을 소유했다가 처분한 경우, 처분 이후부터 다시 계산됩니다.
- 무주택 기간은 최대 15년까지 인정되며, 1년에 2점씩 최대 32점이 부여됩니다.
※ 주택 소유 여부는 등기 및 건축물대장을 기준으로 판단됩니다.`
    } else if (type === 2) {
        modalTitle.value = '부양가족 수란?'
        modalContent.value = `부양가족 수는 청약 신청자 본인을 제외한 동일 세대의 가족 수를 의미합니다.

- 배우자, 직계존속(부모·조부모), 직계비속(자녀·손자녀)을 포함합니다.
- 가족 1인당 5점씩 부여되며, 최대 6인 이상은 35점으로 산정됩니다.
- 배우자가 있으면 1인으로 계산하며, 본인은 포함되지 않습니다.
※ 형제자매는 부양가족으로 인정되지 않으며, 등본 상 세대원이면서 실제 부양 관계가 입증되어야 인정됩니다.`
    } else if (type === 3) {
        modalTitle.value = '청약통장 가입기간이란?'
        modalContent.value = `청약통장 가입기간은 실제로 납입이 완료된 기간만 인정됩니다.

- 최소 6개월 이상부터 점수가 부여되며, 6개월마다 1점씩 최대 17점까지 인정됩니다.
- 매회 최대 10만 원까지의 입금 횟수가 기준이며, 단순 보유만으로는 인정되지 않습니다.
- 예치식 상품(청약예금·부금)의 경우 가입 후 예치 기간으로 산정합니다.
※ 무통장입금 누락, 자동이체 해지 등으로 실제 입금이 되지 않았다면 점수로 인정되지 않습니다.`
    }
}

// 점수 관련
const noHouseScore = ref(0)
const familyScore = ref(0)
const accountScore = ref(0)
const totalScore = ref(null)

const router = useRouter()

const noHouseOptions = [
    { label: '유주택, 30세 미만 미혼인 무주택(0점)', value: 0 },
    { label: '1년 미만(2점)', value: 2 },
    { label: '1년 이상~2년 미만(4점)', value: 4 },
    { label: '2년 이상~3년 미만(6점)', value: 6 },
    { label: '3년 이상~4년 미만(8점)', value: 8 },
    { label: '4년 이상~5년 미만(10점)', value: 10 },
    { label: '5년 이상~6년 미만(12점)', value: 12 },
    { label: '6년 이상~7년 미만(14점)', value: 14 },
    { label: '7년 이상~8년 미만(16점)', value: 16 },
    { label: '8년 이상~9년 미만(18점)', value: 18 },
    { label: '9년 이상~10년 미만(20점)', value: 20 },
    { label: '10년 이상~11년 미만(22점)', value: 22 },
    { label: '11년 이상~12년 미만(24점)', value: 24 },
    { label: '12년 이상~13년 미만(26점)', value: 26 },
    { label: '13년 이상~14년 미만(28점)', value: 28 },
    { label: '14년 이상~15년 미만(30점)', value: 30 },
    { label: '15년 이상(32점)', value: 32 },
]

const accountOptions = [
    { label: '6개월 미만 (1점)', value: 1 },
    { label: '6개월 이상~1년 미만 (2점)', value: 2 },
    { label: '1년 이상~2년 미만 (3점)', value: 3 },
    { label: '2년 이상~3년 미만 (4점)', value: 4 },
    { label: '3년 이상~4년 미만 (5점)', value: 5 },
    { label: '4년 이상~5년 미만 (6점)', value: 6 },
    { label: '5년 이상~6년 미만 (7점)', value: 7 },
    { label: '6년 이상~7년 미만 (8점)', value: 8 },
    { label: '7년 이상~8년 미만 (9점)', value: 9 },
    { label: '8년 이상~9년 미만 (10점)', value: 10 },
    { label: '9년 이상~10년 미만 (11점)', value: 11 },
    { label: '10년 이상~11년 미만 (12점)', value: 12 },
    { label: '11년 이상~12년 미만 (13점)', value: 13 },
    { label: '12년 이상~13년 미만 (14점)', value: 14 },
    { label: '13년 이상~14년 미만 (15점)', value: 15 },
    { label: '14년 이상~15년 미만 (16점)', value: 16 },
    { label: '15년 이상 (17점)', value: 17 },
]

const peopleOptions = [
    { label: '0명', value: 0 },
    { label: '1명', value: 1 },
    { label: '2명', value: 2 },
    { label: '3명', value: 3 },
    { label: '4명', value: 4 },
    { label: '5명', value: 5 },
    { label: '6명 이상', value: 6 },
]

watch(noHouse, (val) => {
    noHouseScore.value = parseInt(val) || 0
})
watch(accountPeriod, (val) => {
    accountScore.value = parseInt(val) || 0
})
watch([hasSpouse, myAscendants, spouseAscendants, descendants], () => {
  const ascendants = parseInt(myAscendants.value || 0)
  const spouseParents = hasSpouse.value ? parseInt(spouseAscendants.value || 0) : 0
  const children = parseInt(descendants.value || 0)

  const totalDependents = ascendants + spouseParents + children

  if (hasSpouse.value === null && totalDependents === 0) {
    // 사용자가 아무것도 선택하지 않은 기본 상태
    familyScore.value = 5
  } else if (!hasSpouse.value && totalDependents === 0) {
    familyScore.value = 5 // 본인 단독
  } else if (hasSpouse.value && totalDependents === 0) {
    familyScore.value = 10 // 배우자만 있음
  } else {
    let counted = hasSpouse.value ? 1 : 0
    counted += totalDependents
    familyScore.value = counted >= 6 ? 35 : 5 + counted * 5
  }
})

const calculateScore = () => {
  // 입력 누락 체크
  if (
    noHouse.value === '' ||
    accountPeriod.value === '' ||
    hasSpouse.value === null
  ) {
    modalTitle.value = '입력값을 확인해주세요'
    modalContent.value =
      '모든 항목을 입력하셔야 가점을 계산할 수 있어요.\n\n' +
      '1. 무주택 기간\n2. 부양가족 유무\n3. 청약통장 가입기간\n\n이 항목들을 모두 선택해주세요.'
    modalVisible.value = true
    return
  }

  totalScore.value = noHouseScore.value + familyScore.value + accountScore.value
  scoreStore.setScore(totalScore.value)
  isCalculated.value = true
}

const evaluateScore = (score) => {
    if (score >= 70) return '당첨 가능성이 매우 높아요!'
    if (score >= 50) return '당첨 가능성이 높은 편이에요!'
    if (score >= 30) return '보통 수준의 가점이에요.'
    return '가점을 높이기 위해 준비가 필요해요.'
}

const reset = () => {
    noHouse.value = ''
    accountPeriod.value = ''
    hasSpouse.value = true
    myAscendants.value = 0
    spouseAscendants.value = 0
    descendants.value = 0
    totalScore.value = null
    isCalculated.value = false
}

const goHome = () => {
    router.push('/')
}
</script>
