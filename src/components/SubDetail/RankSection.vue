<template>
    <!-- 상단 타이틀 -->
    <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
      <User class="w-4 h-4 text-purple-500" />
      <span class="text-extrabold">나의 순위</span>
    </div>
  <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
    <!-- 이모지 -->
    <div class="text-2xl mb-2">🤔</div>

    <!-- 제목 -->
    <p class="text-sm font-semibold text-gray-800 mb-1">청약 순위를 계산해보세요!</p>

    <!-- 설명 -->
    <p class="text-xs text-gray-500 leading-relaxed mb-4">
      주택 소유 현황, 혼인 상태, 부양가족 수 등을 입력하면 <br />
      청약 순위를 정확히 계산해드려요
    </p>

    <!-- 버튼 -->
    <button
      class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-md"
    >
      👤 순위 계산하기
    </button>
  </div>
</template>

<script setup>
// 별도 로직 없음
</script>
