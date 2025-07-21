<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
    <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
    <p class="text-lg text-gray-600 mb-6">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
    <RouterLink
      to="/"
      class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
    >
      홈으로 돌아가기
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
