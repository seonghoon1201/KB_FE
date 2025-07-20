<template>
  <div class="relative min-h-screen bg-gray-50 pt-4">
    <!-- 콘텐츠 영역 -->
    <div class="pb-16">
      <slot />
    </div>

    <!-- 하단 고정 바 -->
    <BottomNavBar />
  </div>
</template>

<script setup>
import BottomNavBar from '@/components/common/BottomNavbar.vue'
</script>
