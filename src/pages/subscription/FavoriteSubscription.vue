<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <BackHeader title="즐겨찾기" />

        <div class="flex-1 px-4 py-6 pb-20">
            <div
                v-if="!favorites || favorites.length === 0"
                class="text-center py-20 text-gray-500"
            >
                즐겨찾기한 청약 공고가 없습니다.
            </div>

            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in sortedFavorites"
                    :key="subscription.apt_idx"
                    :subscription="subscription"
                    :favorite-default="true"
                    @favorite-changed="handleFavoriteToggle(subscription)"
                />
            </div>
        </div>

        <BottomNavbar />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'

const favoritesStore = useFavoritesStore()

// store의 favorites 배열 직접 사용
const favorites = computed(() => favoritesStore.favorites)

const sortedFavorites = computed(() => {
    return [...favorites.value].sort((a, b) => {
        // TODO: 정렬 기준: apt_type 안에 신청 시작일 필드가 있으면 거기 사용
        return (a.apt_idx ?? 0) - (b.apt_idx ?? 0)
    })
})

const handleFavoriteToggle = async (subscription) => {
    // 서버가 사용하는 실제 PK 필드로 넘겨줍니다.
    await favoritesStore.removeFavorite(subscription)
}

onMounted(async () => {
    await favoritesStore.getFavorite()
    // await favoritesStore.fetchFavoritesFromServer()
})
</script>
