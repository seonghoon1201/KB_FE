<template>
  <!-- 상단 타이틀 -->
  <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
    <User class="w-4 h-4 text-purple-500" />
    <span class="text-extrabold">나의 순위</span>
  </div>

  <!-- 계산 완료 상태 -->
  <div v-if="isCalculated" class="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center space-y-4">
    <div>
      <p class="text-sm text-gray-600">나의 청약 순위</p>
      <p class="text-3xl font-extrabold text-red-400">1순위</p>
      <p class="text-xs text-purple-600 font-medium">1순위 (무주택 세대주)</p>
      <p class="text-xs text-gray-500">무주택 세대주로서 부양가족이 있는 기혼자</p>
    </div>

    <div class="bg-white rounded-lg p-3 border text-left text-sm text-gray-700 space-y-1">
      <div class="flex items-start gap-2">
        <Check class="w-4 h-4 text-green-500 mt-0.5" />
        <div>
          <p class="font-medium">해당 조건</p>
          <ul class="list-disc ml-5 mt-1 space-y-0.5 text-gray-600 text-xs">
            <li>무주택 세대주</li>
            <li>기혼자 또는 미혼자(만30세 이상, 5년 이상 독립거주)</li>
            <li>부양가족 2명</li>
          </ul>
        </div>
      </div>
    </div>

    <button
      @click="resetRank"
      class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-md"
    >
      순위 다시 계산하기
    </button>
  </div>

  <!-- 계산 전 상태 -->
  <div v-else class="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
    <div class="text-2xl mb-2">🤔</div>
    <p class="text-sm font-semibold text-gray-800 mb-1">청약 순위를 계산해보세요!</p>
    <p class="text-xs text-gray-500 leading-relaxed mb-4">
      주택 소유 현황, 혼인 상태, 부양가족 수 등을 입력하면 <br />
      청약 순위를 정확히 계산해드려요
    </p>
    <button
      @click="calculateRank"
      class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-md"
    >
      👤 순위 계산하기
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Check } from 'lucide-vue-next'

const isCalculated = ref(false)

function calculateRank() {
  isCalculated.value = true
}

function resetRank() {
  isCalculated.value = false
}
</script>
