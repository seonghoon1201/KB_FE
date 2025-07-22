<template>
    <header
        class="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between w-full bg-[#DDF1FB] px-4 py-3 min-h-[56px] shadow"
    >
        <!-- 왼쪽: 로고/텍스트 -->
        <div @click="goHome" class="text-base font-semibold text-black cursor-pointer">zibi</div>

        <!-- 오른쪽: 알림, 메뉴 -->
        <div class="flex items-center gap-x-6">
            <div v-if="showAlarm">
                <Bell @click="alarmClick" class="w-6 h-6 text-gray-700" />
            </div>
            <div v-else class="relative">
                <BellDot @click="alarmClick" class="w-6 h-6 text-gray-700" />
                <div
                    class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"
                    style="transform: translate(50%, -50%)"
                ></div>
            </div>
            <div>
                <Menu @click="menuClick" class="w-6 h-6 text-gray-700" />
            </div>
        </div>
    </header>
</template>

<script setup>
import { Bell, BellDot, Menu } from 'lucide-vue-next'
import { ref } from 'vue'
import { useCommonStore } from '@/stores/common'
import { useRouter } from 'vue-router'

const modalStore = useCommonStore()
const showAlarm = ref(true)
const router = useRouter()

const goHome = () => {
    router.push('/')
}

const alarmClick = () => {
    console.log('alarm click => open alarm')
}

const menuClick = () => {
    modalStore.modalOnOff()
}
</script>
