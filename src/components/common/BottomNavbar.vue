<template>
  <nav
    style="border-top: 1px solid gray"
    class="sticky fixed bottom-0 left-0 w-full bg-white border-t border-red-50 flex justify-around py-2 z-50"
  >
    <div
      v-for="(item, index) in navItems"
      :key="index"
      class="flex flex-col items-center text-xs cursor-pointer"
      :class="activeIndex === index ? 'text-black' : 'text-gray-400'"
      @click="setActive(index)"
    >
      <component :is="item.iconInactive" :size="30" stroke-width="1.2" class="w-10 h-10" />
      <span class="text-[10px] font-sans">{{ item.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Home, Calendar, FileText, Map, Heart } from 'lucide-vue-next'

const activeIndex = ref(0)
const setActive = (index) => {
  activeIndex.value = index
}

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
]
</script>
