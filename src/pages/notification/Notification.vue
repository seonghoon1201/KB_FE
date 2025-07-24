<template>
    <div class="min-h-screen bg-white pt-20 px-4 pb-10">
        <!-- 상단 헤더 -->
        <BackHeader title="알림" />

        <!-- 탭 메뉴 & 모두 읽음 처리 -->
        <div class="flex items-center justify-between mt-4 mb-4">
            <div class="flex gap-6 text-sm font-semibold">
                <button :class="tabClass('all')" @click="activeTab = 'all'">모두</button>
                <button :class="tabClass('unread')" @click="activeTab = 'unread'">
                    안읽은 알림
                </button>
                <button :class="tabClass('read')" @click="activeTab = 'read'">읽은 알림</button>
            </div>
            <button
                class="text-xs text-blue-500 font-medium hover:underline"
                @click="markAllAsRead"
            >
                모두 읽음 처리
            </button>
        </div>

        <!-- 알림 리스트 -->
        <div class="space-y-3">
            <router-link
                v-for="(item, idx) in filteredNotifications"
                :key="idx"
                :to="`/notification/${item.id}`"
                class="block"
            >
                <div
                    :class="[
                        'rounded-xl p-4 shadow-sm flex justify-between items-start',
                        item.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200',
                    ]"
                >
                    <div>
                        <div class="flex items-center gap-1 mb-1">
                            <span class="text-xs">📢</span>
                            <p
                                :class="[
                                    'text-sm font-semibold',
                                    item.isRead ? 'text-gray-500' : 'text-gray-900',
                                ]"
                            >
                                {{ item.title }}
                            </p>
                        </div>
                        <p class="text-xs text-gray-400">{{ item.date }}</p>
                    </div>
                    <div class="text-xs text-gray-400 whitespace-nowrap">{{ item.timeAgo }}</div>
                </div>
            </router-link>

            <p
                v-if="filteredNotifications.length === 0"
                class="text-sm text-gray-400 text-center pt-10"
            >
                해당하는 알림이 없습니다.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useNotificationStore } from '@/stores/notificationStore'

// ✅ 알림 상태
const notifications = ref([
    {
        id: 1,
        title: '7월 예치금 미납',
        date: '2025.07.31 자정',
        timeAgo: '3분 전',
        isRead: false,
    },
    {
        id: 2,
        title: '힐스테이트 청약',
        date: '',
        timeAgo: '1시간 전',
        isRead: true,
    },
    {
        id: 3,
        title: '청약 마감 임박 안내',
        date: '',
        timeAgo: '2일 전',
        isRead: false,
    },
])

// ✅ 탭 필터링 상태: all | unread | read
const store = useNotificationStore()
const activeTab = ref('all')

// ✅ 필터링된 알림
const filteredNotifications = computed(() => {
    if (activeTab.value === 'unread') {
        return store.notifications.filter((n) => !n.isRead)
    } else if (activeTab.value === 'read') {
        return store.notifications.filter((n) => n.isRead)
    }
    return store.notifications
})

const tabClass = (tab) =>
    activeTab.value === tab
        ? 'text-black border-b-2 border-black pb-1'
        : 'text-gray-400 hover:text-black pb-1'

const markAllAsRead = () => {
    store.markAllAsRead()
}
</script>
