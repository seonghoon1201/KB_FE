<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- 헤더 -->
        <BackHeader title="청약 공고" />

        <!-- 필터 버튼들 (옵셔널) -->
        <div class="px-4 py-3 bg-white border-b border-gray-100">
            <div class="justify-center flex space-x-2 overflow-x-auto">
                <button
                    v-for="filter in filters"
                    :key="filter.key"
                    @click="handleFilterClick(filter)"
                    :class="[
                        'flex items-center gap-1 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
                        selectedFilter === filter.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    ]"
                >
                    <!-- 아이콘 -->
                    <component :is="filter.icon" class="w-4 h-4" />

                    <!-- 텍스트 -->
                    <span>{{ filter.label }}</span>
                </button>
            </div>
        </div>

        <!-- 공고 목록 -->
        <div class="flex-1 px-4 py-4 pb-20">
            <div v-if="filteredSubscriptions.length === 0" class="text-center py-12">
                <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
            </div>

            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in filteredSubscriptions"
                    :key="subscription.id"
                    :subscription="subscription"
                    :favorite-default="favoritesStore.favoriteIds.has(subscription.id)"
                    @favorite-changed="(id) => favoritesStore.toggleFavorite(id)"
                />
            </div>
        </div>

        <BottomNavbar />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { allSubscriptions } from '@/data/subscription-data'
import { useFavoritesStore } from '@/stores/favorites'
import { TrendingUp, Clock, ArrowDownWideNarrow } from 'lucide-vue-next'

const favoritesStore = useFavoritesStore()

const subscriptions = ref(allSubscriptions)

const selectedFilter = ref('latest')

const filters = [
    { key: 'latest', label: '최신순', icon: TrendingUp },
    { key: 'deadline-first', label: '마감임박순', icon: Clock },
    { key: 'filter', label: '필터', icon: ArrowDownWideNarrow, isCustom: true },
]

const showCustomFilter = ref(false)

const customFilter = ref({
  location: '',
  area: '',
  price: '',
})


// 필터링된 청약 공고 목록
const filteredSubscriptions = computed(() => {
    let result = [...subscriptions.value]

    // 정렬 적용
    switch (selectedFilter.value) {
        case 'latest':
            // 최신순 정렬 (신청 시작일이 빠른 순)
            result.sort((a, b) => {
                const aStartDate = new Date(a.applicationStartDate.replace(/\./g, '-'))
                const bStartDate = new Date(b.applicationStartDate.replace(/\./g, '-'))
                return aStartDate - bStartDate
            })
            break

        case 'deadline-first':
            // 마감임박순 정렬 (마감일이 빠른 순)
            result.sort((a, b) => {
                const aCompleteDate = new Date(a.applicationCompleteDate.replace(/\./g, '-'))
                const bCompleteDate = new Date(b.applicationCompleteDate.replace(/\./g, '-'))
                return aCompleteDate - bCompleteDate
            })
            break

        default:
            // 기본은 최신순
            result.sort((a, b) => {
                const aStartDate = new Date(a.applicationStartDate.replace(/\./g, '-'))
                const bStartDate = new Date(b.applicationStartDate.replace(/\./g, '-'))
                return aStartDate - bStartDate
            })
    }

    return result
})

// 필터 클릭 핸들러
const handleFilterClick = (filter) => {
  if (filter.isCustom) {
    showCustomFilter.value = !showCustomFilter.value
  } else {
    selectedFilter.value = filter.key
    showCustomFilter.value = false // 맞춤 필터는 숨김
  }
}

const handleFavoriteChanged = (subscriptionId) => {
    const nowFavorite = favoritesStore.toggleFavorite(subscriptionId)
    console.log(`ID: ${subscriptionId}, 즐겨찾기 상태: ${nowFavorite}`)
}

onMounted(() => {
    favoritesStore.initializeFavorites()
})
</script>
