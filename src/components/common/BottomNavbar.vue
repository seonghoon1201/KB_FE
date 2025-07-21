<!--
<template>
  <nav
    class="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50"
  >
    <div
      v-for="(item, index) in navItems"
      :key="index"
      class="flex flex-col items-center text-xs cursor-pointer"
      :class="activeIndex === index ? 'text-black' : 'text-gray-400'"
      @click="setActive(index)"
    >
      <component :is="item.iconInactive" class="w-6 h-6 mb-1" />
      <span>{{ item.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import {
  Home,
  Calendar,
  FileText,
  Map,
  Heart,
} from 'lucide-vue-next';

const activeIndex = ref(0);
const setActive = (index) => {
  activeIndex.value = index;
};

const navItems = [
  {
    label: '홈',
    iconInactive: Home,
  },
  {
    label: '달력',
    iconInactive: Calendar,
  },
  {
    label: '청약 정보',
    iconInactive: FileText,
  },
  {
    label: '지도',
    iconInactive: Map,
  },
  {
    label: '즐겨찾기',
    iconInactive: Heart,
  },
];
</script>
-->