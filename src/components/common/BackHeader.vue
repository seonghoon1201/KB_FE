<template>
    <header
        class="fixed top-0 left-0 right-0 z-[40] flex items-center justify-between w-full bg-[#DDF1FB] px-4 py-3 min-h-[56px] shadow"
    >
        <div><ChevronLeft @click="backClick" /></div>
        <div
            @click="titleClick"
            class="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg"
        >
            {{ props.title }}
        </div>
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
import { ref } from 'vue'
import { useCommonStore } from '@/stores/common'
import { useRouter } from 'vue-router'

// ✅ props로 제목 받기
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
})

const router = useRouter()
const modalStore = useCommonStore()
const showAlarm = ref(true)

const backClick = () => {
    router.back()
}

const titleClick = () => {
    console.log(`title ${props.title} click`)
}

const alarmClick = () => {
    router.push('/notification')
}

const menuClick = () => {
    modalStore.modalOnOff()
}
</script>

<style></style>
