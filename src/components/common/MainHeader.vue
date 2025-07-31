<template>
    <header
        class="fixed top-0 left-0 right-0 z-[40] flex items-center justify-between w-full bg-[#DDF1FB] px-4 py-3 min-h-[56px] shadow"
    >
        <!-- 왼쪽: 로고 -->
        <div @click="goHome" class="text-xl font-bold text-black cursor-pointer">zibi</div>

        <!-- 오른쪽: 알림, 메뉴 (BackHeader와 동일하게 수정) -->
        <div class="flex items-center space-x-4">
            <div v-if="showAlarm">
                <Bell @click="alarmClick" />
            </div>
            <div v-else class="relative inline-block">
                <BellDot @click="alarmClick" />
                <div
                    class="absolute top-2 right-1.5 w-2 h-2 bg-red-500 rounded-full board-2 border-red"
                    style="transform: translate(50%, -50%)"
                ></div>
            </div>
            <div>
                <Menu @click="menuClick" />
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
    router.push('/home')
}

const alarmClick = () => {
    router.push('/notification')
}

const menuClick = () => {
    modalStore.modalOnOff()
}
</script>
