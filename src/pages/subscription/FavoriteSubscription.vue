<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
        <BackHeader />

        <div v-if="favoriteSubscriptions.length === 0" class="text-gray-500 py-20">
            즐겨찾기한 청약 공고가 없습니다.
        </div>

        <div v-else class="space-y-4">
            <SubscriptionCard
                v-for="sub in favoriteSubscriptions"
                :key="sub.id"
                :subscription="sub"
                :favoriteDefault="true"
                @favorite-changed="handleFavoriteChanged"
            />
        </div>
    </div>
    <BottomNavbar />
</template>

<script setup>
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import BackHeader from '@/components/common/BackHeader.vue'

import { ref, computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useSubscriptionsStore } from '@/stores/subscription'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'

// 스토어 초기화
const favoritesStore = useFavoritesStore()
favoritesStore.initializeFavorites()

const subscriptionsStore = useSubscriptionsStore()
// 스토어가 ref([])로 정의되어 있다면 .value 붙이고,
// reactive([]) 또는 plain array라면 .value 없이 사용하세요.
const allSubscriptions = subscriptionsStore.subscriptions

// 즐겨찾기된 공고만 필터링
const favoriteSubscriptions = computed(() =>
    favoritesStore.getFavoriteSubscriptions(
        // ref로 정의된 경우엔 .value, 그렇지 않으면 생략
        Array.isArray(allSubscriptions.value) ? allSubscriptions.value : allSubscriptions,
    ),
)

// 하트 클릭 처리
const handleFavoriteChanged = (subscriptionId) => {
    favoritesStore.toggleFavorite(subscriptionId)
}
</script>
