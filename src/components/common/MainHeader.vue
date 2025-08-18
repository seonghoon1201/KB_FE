<template>
    <header
        class="fixed top-0 left-0 right-0 z-[40] flex items-center justify-between w-full bg-[#DDF1FB] px-4 py-3 min-h-[56px] shadow"
    >
        <!-- 왼쪽: 로고 -->
        <div @click="goHome" class="text-xl font-bold text-black cursor-pointer">zibi</div>

        <!-- 오른쪽: 알림, 메뉴 -->
        <div class="flex items-center space-x-4">
            <a-badge :count="unreadCount" class="inline-flex items-center">
                <button type="button" class="icon-btn" @click="alarmClick" aria-label="알림">
                    <Bell class="w-6 h-6" />
                </button>
            </a-badge>
            <button type="button" class="icon-btn" @click="menuClick" aria-label="메뉴">
                <Menu class="w-6 h-6" />
            </button>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Bell, BellDot, Menu } from 'lucide-vue-next'
import { useCommonStore } from '@/stores/common'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'

const modalStore = useCommonStore()
const noticeStore = useNotificationStore()
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

const { unreadCount } = storeToRefs(noticeStore)

onMounted(() => {
    noticeStore.countIsRead()
})
</script>
