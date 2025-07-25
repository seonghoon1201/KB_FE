<template>
    <div class="min-h-screen bg-white pt-20 px-4 pb-12">
        <!-- 상단 헤더 -->
        <BackHeader title="알림 상세" />

        <!-- 알림 상세 내용 -->
        <div class="mt-6 bg-[#F8FBFD] border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <!-- 제목 -->
            <h2 class="text-lg font-bold text-gray-900">{{ notification.title }}</h2>

            <!-- 수신 시각 -->
            <p class="text-sm text-gray-400">
                {{ notification.date }} · {{ notification.timeAgo }}
            </p>

            <!-- 본문 -->
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {{ notification.body }}
            </p>

            <!-- 예: 관련 링크 -->
            <div v-if="notification.link" class="pt-2">
                <router-link
                    :to="notification.link"
                    class="text-blue-500 text-sm font-medium underline hover:text-blue-700"
                >
                    관련 페이지로 이동하기 →
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BackHeader from '@/components/common/BackHeader.vue'
import { useNotificationStore } from '@/stores/notificationStore'

// ✅ 예시: route param 기반 알림 ID 가져오기
const route = useRoute()
const notificationId = route.params.id
const store = useNotificationStore()

// ✅ 더미 알림 데이터 (실제는 API로 가져오기)
const dummyNotifications = [
    {
        id: '1',
        title: '7월 예치금 미납',
        date: '2025.07.31 자정',
        timeAgo: '3분 전',
        body: `회원님의 7월 예치금 납입이 확인되지 않았습니다.\n빠른 시일 내에 예치금을 납입해 주세요.`,
        link: '/account/detail',
    },
    {
        id: '2',
        title: '힐스테이트 청약 접수 시작',
        date: '2025.07.30',
        timeAgo: '1일 전',
        body: `힐스테이트 아파트의 청약 접수가 시작되었습니다.\n지금 바로 신청하실 수 있습니다.`,
        link: '/subscription/detail/123',
    },
]

// ✅ 상세 알림 찾기
const notification = store.notifications.find((n) => n.id === notificationId) || {
    title: '알림을 찾을 수 없습니다.',
    date: '',
    timeAgo: '',
    body: '',
}

// ✅ 읽음 처리 (초기 진입 시)
store.markAsRead(notificationId)

</script>
