<script setup>
import BottomTab from '@/components/common/BottomNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- 메인 콘텐츠 영역 -->
    <main class="flex-1 px-4 pb-24">
      <slot />
    </main>

    <!-- 하단 탭 메뉴 -->
    <BottomTab />
  </div>
</template>

<style scoped>
/* 필요한 경우 커스텀 스타일 추가 가능 */
</style>
