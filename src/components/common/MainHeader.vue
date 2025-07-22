<!-- 메인 헤더 컴포넌트 -->
<template>
    <div
        class="flex items-center justify-between w-full h-15 border border-black px-4 py-2 bg-[#DDF1FB]"
    >
        <div @click="backClick">zibi</div>
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
    </div>
</template>
<script setup>
import { Bell, BellDot, Menu } from 'lucide-vue-next'
import { ref, reactive } from 'vue'

import { modalOpen, modalClose } from '../../stores/common'

let showAlarm = ref(true)

const backClick = () => {
    console.log('zibi click => go to home')
}

const alarmClick = () => {
    console.log('alarm click => open alarm')
}

const menuClick = () => {
    console.log('menu click => open menu')
}
</script>
<style></style>
