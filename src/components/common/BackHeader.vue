<!-- 메인 헤더 컴포넌트 -->

<template>
    <header
        class="fixed top-0 left-0 right-0 z-[40] flex items-center justify-between w-full bg-[#DDF1FB] px-4 py-3 min-h-[56px] shadow"
    >
        <div><ChevronLeft @click="backClick" /></div>
        <div @click="titleClick">{{ title }}</div>
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
import { ChevronLeft, Bell, BellDot, Menu } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import { useCommonStore } from '@/stores/common'
import { useRouter } from 'vue-router'

let modalStore = useCommonStore()
const router = useRouter()
let showAlarm = ref(true)
let title = ref('title11')

const backClick = () => {
    console.log('back button click')
}

const titleClick = () => {
    console.log(`title ${title.value} click`)
}

const alarmClick = () => {
    router.push('/notification')
}

const menuClick = () => {
    modalStore.modalOnOff()
}
</script>
<style></style>
