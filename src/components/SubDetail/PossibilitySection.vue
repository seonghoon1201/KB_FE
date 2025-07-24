<template>
  <div>
    <!-- 상단 타이틀 -->
    <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
      <Smile class="w-4 h-4 text-gray-500" />
      <span>나의 당첨 가능성</span>
    </div>

    <!-- 계산 완료 상태 -->
    <div
      v-if="isCalculated"
      class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-4"
    >
      <!-- 타이틀 -->
      <div>
        <p class="text-sm text-gray-800">
          <span class="text-base font-bold">{{ subscription.title }}</span>
          청약에 대한 나의 당첨 가능성은
        </p>
        <p :class="resultTextClass" class="text-base font-extrabold mt-1">
          {{ resultText }}
        </p>
        <p class="text-[11px] text-gray-400 mt-1">
          {{ resultSubText }}
        </p>
      </div>

      <!-- 정보 박스 -->
      <div class="bg-white rounded-lg p-3 border text-left text-sm text-gray-700 space-y-1">
        <div class="flex items-start gap-2">
          <Check class="w-4 h-4 text-green-500 mt-0.5" />
          <div>
            <p class="font-medium">당첨 가능성 예측에 사용된 정보</p>
            <ul class="list-disc ml-5 mt-1 space-y-0.5 text-gray-600 text-xs">
              <li>해당 청약의 공급 세대수</li>
              <li>나의 순위</li>
              <li>나의 가점</li>
              <li>예측 지원자수</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 다시 확인하기 버튼 -->
      <button
        @click="resetCalc"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md"
      >
        당첨 가능성 다시 확인하기
      </button>
    </div>

    <!-- 계산 전 상태 -->
    <div v-else class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
      <!-- 이모티콘 -->
      <div class="text-2xl mb-2">🧑‍🏫</div>
      <p class="text-sm font-semibold text-gray-800 mb-1">당첨 가능성을 알아볼까요?</p>
      <p class="text-xs text-gray-500 leading-relaxed mb-4">
        해당 청약에 관심이 있으시군요!<br />
        지비가 회원님의 청약 당첨 가능성을 알려드려요.
      </p>
      <button
        @click="calculate"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md
               flex items-center justify-center gap-1"
      >
        <Sparkles class="w-4 h-4" />
        당첨 가능성 확인하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Smile, Sparkles, Check } from 'lucide-vue-next'

const isCalculated = ref(false)
const subscription = { title: '힐스테이트' }

// ✅ 더미 등급 값: 'very_low' | 'low' | 'medium' | 'high'
const resultLevel = ref('very_low')

function calculate() {
  // 추후 백엔드 API 응답으로 이 값 세팅 예정
  resultLevel.value = 'very_low' // 임시 더미값
  isCalculated.value = true
}

function resetCalc() {
  isCalculated.value = false
}

// ✅ 조건에 따라 텍스트/색상 변경
const resultText = computed(() => {
  switch (resultLevel.value) {
    case 'very_low':
      return '당첨 가능성 매우 낮음'
    case 'low':
      return '당첨 가능성 낮음'
    case 'medium':
      return '당첨 가능성 보통'
    case 'high':
      return '당첨 가능성 높음'
    default:
      return ''
  }
})

const resultTextClass = computed(() => {
  switch (resultLevel.value) {
    case 'very_low':
      return 'text-red-500'
    case 'low':
      return 'text-orange-500'
    case 'medium':
      return 'text-yellow-500'
    case 'high':
      return 'text-green-600'
    default:
      return ''
  }
})

const resultSubText = computed(() => {
  switch (resultLevel.value) {
    case 'very_low':
      return '예측 당첨 확률이 20% 미만으로 낮습니다. 다른 청약도 함께 고려해보세요.'
    case 'low':
      return '당첨 확률이 낮습니다. 다른 청약도 함께 고려해보세요.'
    case 'medium':
      return '경쟁률이 평균적입니다. 도전해볼만 해요!'
    case 'high':
      return '당첨 확률이 높은 편이에요! 기대해보셔도 좋아요!'
    default:
      return ''
  }
})
</script>
