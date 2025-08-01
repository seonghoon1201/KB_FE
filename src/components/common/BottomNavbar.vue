<template>
    <nav
        class="fixed bottom-0 left-0 w-full bg-white border-t border-black-50 flex justify-around py-2 z-40"
    >
        <div
            v-for="(item, index) in navItems"
            :key="index"
            class="flex flex-col items-center text-xs cursor-pointer"
            :class="isActive(item.path) ? 'text-black' : 'text-gray-400'"
            @click="navigateTo(item.path)"
        >
            <component :is="item.iconInactive" :size="30" stroke-width="1.2" class="w-10 h-10" />
            <span class="text-[13px] font-sans">{{ item.label }}</span>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, Calendar, FileText, Map, Heart } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navigateTo = (path) => {
    router.push(path)
}

const isActive = (path) => {
    return route.path === path
}

const navItems = [
    {
        label: '홈',
        iconInactive: Home,
        path: '/home',
    },
    {
        label: '달력',
        iconInactive: Calendar,
        path: '/calendar',
    },
    {
        label: '청약 정보',
        iconInactive: FileText,
        path: '/subscriptions',
    },
    {
        label: '지도',
        iconInactive: Map,
        path: '/map',
    },
    {
        label: '즐겨찾기',
        iconInactive: Heart,
        path: '/favorites',
    },
]
</script>
