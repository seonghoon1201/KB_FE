<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- 헤더 -->
        <BackHeader title="즐겨찾기" />

        <!-- 즐겨찾기 공고 목록 -->
        <div class="flex-1 px-4 py-6 pb-20">
            <div v-if="favoriteSubscriptions.length === 0" class="text-center py-20 text-gray-500">
                즐겨찾기한 청약 공고가 없습니다.
            </div>

            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in favoriteSubscriptions"
                    :key="subscription.id"
                    :subscription="subscription"
                    :favorite-default="true"
                    @favorite-changed="handleFavoriteToggle"
                />
            </div>
        </div>

        <!-- 하단 네비게이션 -->
        <BottomNavbar />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'

// 스토어
const favoritesStore = useFavoritesStore()

// 전체 청약 공고 (예: 외부에서 받아오거나 import)
import { allSubscriptions } from '@/data/subscription-data' // 또는 props로 전달

// 즐겨찾기된 공고 필터링
const favoriteSubscriptions = computed(() => {
    return favoritesStore.getFavoriteSubscriptions(allSubscriptions)
})

// 즐겨찾기 토글 핸들러
const handleFavoriteToggle = (id) => {
    favoritesStore.toggleFavorite(id)
}

onMounted(() => {
    favoritesStore.initializeFavorites()
})
</script>
