<template>
    <div class="bg-white min-h-screen px-4 py-6 space-y-6">
        <!-- 상단 설명 박스 -->
        <div class="bg-[#F5F2FD] p-4 rounded-lg text-center space-y-1">
            <h1 class="text-base font-semibold text-indigo-600">📊 청약 가점 계산기</h1>
            <p class="text-xs text-gray-600">
                청약 가점은 무주택 기간, 부양가족 수, 청약통장 가입기간으로 계산됩니다.
            </p>
        </div>

        <!-- 무주택 기간 -->
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-medium text-gray-800"
                >1. 무주택 기간 (최대 32점)</label
            >
            <Dropdown v-model="noHouse" :options="noHouseOptions" />
            <p class="text-xs text-indigo-600">무주택 기간 점수: {{ noHouseScore }}점</p>
        </div>

        <!-- 부양가족 -->
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-medium text-gray-800"
                >2. 부양가족 수 (최대 35점)</label
            >
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
            <label class="block text-sm font-medium text-gray-800"
                >3. 청약통장 가입기간 (최대 17점)</label
            >
            <Dropdown v-model="accountPeriod" :options="accountOptions" />
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
                <PrimaryButton customClass="bg-gray-100 text-gray-700" @click="goHome"
                    >홈으로 돌아가기</PrimaryButton
                >
                <PrimaryButton customClass="bg-[#A48BFF] text-white" @click="reset"
                    >다시 계산하기</PrimaryButton
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Dropdown from '@/components/common/Dropdown.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { useScoreStore } from '@/stores/score'

const scoreStore = useScoreStore()
const noHouse = ref('')
const accountPeriod = ref('')
const hasSpouse = ref(true)
const myAscendants = ref(0)
const spouseAscendants = ref(0)
const descendants = ref(0)
const isCalculated = ref(false)

// 점수
const noHouseScore = ref(0)
const familyScore = ref(0)
const accountScore = ref(0)
const totalScore = ref(null)

const router = useRouter()

// 무주택 기간 (피그마 기준)
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

// 청약통장 가입기간
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

// 인원 선택 드롭다운
const peopleOptions = [
    { label: '0명', value: 0 },
    { label: '1명', value: 1 },
    { label: '2명', value: 2 },
    { label: '3명', value: 3 },
    { label: '4명', value: 4 },
    { label: '5명', value: 5 },
    { label: '6명 이상', value: 6 },
]

// 항목별 점수는 watch로 자동 계산
watch(noHouse, (val) => {
  noHouseScore.value = parseInt(val) || 0
})
watch(accountPeriod, (val) => {
  accountScore.value = parseInt(val) || 0
})
watch([hasSpouse, myAscendants, spouseAscendants, descendants], () => {
  let count = 0
  if (hasSpouse.value) count += 1
  count += parseInt(myAscendants.value || 0)
  count += parseInt(spouseAscendants.value || 0)
  count += parseInt(descendants.value || 0)
  familyScore.value = count >= 6 ? 35 : count * 5
})

// 전체 점수는 버튼 눌렀을 때만 계산
const calculateScore = () => {
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
