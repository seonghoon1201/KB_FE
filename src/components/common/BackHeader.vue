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
import { ChevronLeft, Bell, BellDot, Menu } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores/common'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'

// ✅ props로 제목 받기
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
})

const router = useRouter()
const route = useRoute()
const modalStore = useCommonStore()
const noticeStore = useNotificationStore()

const backClick = () => {
    const segments = route.path.slice(1).split('/')
    const fullPath = route.path

    // ✅ 1) '최근 본 공고' 예외처리
    // - 라우트 이름 또는 경로로 식별 (이름/경로 중 하나만 맞아도 동작)
    const RECENT_VIEWED_ROUTE_NAMES = ['RecentlyViewedSupscription', 'RecentlyViewedSubscription']
    const RECENT_VIEWED_PATHS = [
        '/subscription/recent',
        '/subscription/recently-viewed',
        '/subscription/recentlyViewed', // 프로젝트에 맞춰 필요한 것만 남기세요
    ]``

    if (RECENT_VIEWED_ROUTE_NAMES.includes(route.name) || RECENT_VIEWED_PATHS.includes(fullPath)) {
        router.push('/mypage')
        return
    }

    // ✅ 2) 일반 뒤로가기 규칙 (상위 depth면 back, 아니면 홈/마이페이지)
    const backPath = ['subscriptions', 'mypage'] // 상위 depth를 갖는 섹션
    if (backPath.includes(segments[0]) && segments.length > 1) {
        router.back()
    } else {
        router.push('/home')
    }
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

const { unreadCount } = storeToRefs(noticeStore)

onMounted(() => {
    noticeStore.countIsRead()
})
</script>

<style></style>
