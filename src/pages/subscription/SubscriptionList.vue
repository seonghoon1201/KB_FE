<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- 헤더 -->
        <BackHeader title="청약 공고" />

        <!-- 필터 버튼들 (옵셔널) -->
        <!-- 🔹 정렬 & 필터 버튼 바 -->
        <div class="px-4 py-3 bg-white border-b border-gray-100 flex items-center relative">
            <!-- 중앙 정렬: 정렬 기준 버튼 -->
            <div class="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                    v-for="sortStandard in sortStandards"
                    :key="sortStandard.key"
                    @click="handleSortClick(sortStandard)"
                    :class="[
                        'flex items-center gap-1 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
                        selectedFilter === sortStandard.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    ]"
                >
                    <component :is="sortStandard.icon" class="w-4 h-4" />
                    <span>{{ sortStandard.label }}</span>
                </button>
            </div>

            <!-- 오른쪽 끝 필터 버튼 -->
            <button
                @click="toggleFilter"
                class="ml-auto z-10 flex items-center gap-1 px-3 py-2 rounded-full text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                <ArrowDownWideNarrow class="w-4 h-4" />
                <span>필터</span>
            </button>
        </div>

        <!-- 🔽 필터 모달 -->
        <SubscriptionFilterModal
            :visible="isFilterOpen"
            :selectedRegions="selectedRegions"
            :selectedAreas="selectedAreas"
            :priceMin="priceMin"
            :priceMax="priceMax"
            :selectedCity="selectedCity"
            :selectedDistrict="selectedDistrict"
            @update:visible="isFilterOpen = $event"
            @update="handleFilterUpdate"
            @apply="applyFilters"
        />

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
import { TrendingUp, Clock, ArrowDownWideNarrow, SquareUser } from 'lucide-vue-next'
import { districts } from '@/data/districts'
import { areaOptions } from '@/data/area'
import SubscriptionFilterModal from '@/components/modal/SubscriptionFilterModal.vue'

const favoritesStore = useFavoritesStore()

const subscriptions = ref(allSubscriptions)

const selectedFilter = ref('latest')

const isFilterOpen = ref(false)

const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const priceMin = ref(null)
const priceMax = ref(null)

const sortStandards = [
    { key: 'latest', label: '최신순', icon: TrendingUp },
    { key: 'deadline-first', label: '마감임박순', icon: Clock },
]

const filters = [{ key: 'filter', label: '필터', icon: ArrowDownWideNarrow, isCustom: true }]

const appliedFilters = ref({
    regions: [],
    squareMeters: [],
    priceMin: null,
    priceMax: null,
})

const cities = Object.keys(districts)

const showCustomFilter = ref(false)

const removeSelectedRegion = (index) => {
    selectedRegions.value.splice(index, 1)
}

const customFilter = ref({
    location: '',
    squareMeter: '',
    price: '',
})

const selectedAreas = ref([])

const toggleArea = (val) => {
    const valStr = val.toString()
    const exists = selectedAreas.value.some((a) => a.toString() === valStr)
    if (exists) {
        selectedAreas.value = selectedAreas.value.filter((a) => a.toString() !== valStr)
    } else {
        selectedAreas.value.push([...val]) // 깊은 복사해서 추가
    }
}

// 필터링된 청약 공고 목록
const filteredSubscriptions = computed(() => {
    let result = [...subscriptions.value]

    // 정렬
    switch (selectedFilter.value) {
        case 'latest':
            result.sort(
                (a, b) => new Date(a.applicationStartDate) - new Date(b.applicationStartDate),
            )
            break
        case 'deadline-first':
            result.sort(
                (a, b) => new Date(a.applicationCompleteDate) - new Date(b.applicationCompleteDate),
            )
            break
    }

    // 지역 필터
    if (appliedFilters.value.regions.length > 0) {
        result = result.filter((item) =>
            appliedFilters.value.regions.some(
                (region) => item.city === region.city && item.district === region.district,
            ),
        )
    }

    // 평수 필터
    if (appliedFilters.value.squareMeters.length > 0) {
        result = result.filter((item) => {
            const squareMeter = Number(item.squareMeters)
            const match = appliedFilters.value.squareMeters.some(([min, max]) => {
                const matched = squareMeter >= min && squareMeter <= max
                console.log(`🧪 ${squareMeter} in [${min}, ${max}]? => ${matched}`)
                return matched
            })
            return match
        })
    }

    // 가격 필터
    if (appliedFilters.value.priceMin !== null || appliedFilters.value.priceMax !== null) {
        result = result.filter((item) => {
            const price = stringPriceToNumber(item.price) / 10000 // 만원 단위로 환산

            return (
                (appliedFilters.value.priceMin === null ||
                    price >= appliedFilters.value.priceMin) &&
                (appliedFilters.value.priceMax === null || price <= appliedFilters.value.priceMax)
            )
        })
    }

    return result
})

// 3️⃣ 필터 적용 버튼 클릭 시
const applyFilters = () => {
    console.log('✅ selectedRegions before apply:', selectedRegions.value)
    const parsedAreas = selectedAreas.value.map((val) => {
        if (typeof val === 'string') {
            const [min, max] = val.split(',').map(Number)
            return [min, max]
        }
        return val
    })

    console.log('🟡 selectedAreas.value:', selectedAreas.value)
    console.log('🟢 parsedAreas:', parsedAreas)

    appliedFilters.value = {
        regions: [...selectedRegions.value],
        squareMeters: parsedAreas,
        priceMin: priceMin.value,
        priceMax: priceMax.value,
    }

    isFilterOpen.value = false
}

const stringPriceToNumber = (str) => {
    if (!str) return 0
    return parseInt(str.replace(/,/g, ''), 10)
}

const expandAreaRanges = (ranges) => {
    const allSizes = []
    ranges.forEach(([min, max]) => {
        for (let i = min + 1; i <= max; i++) {
            allSizes.push(i)
        }
    })
    return allSizes
}

const toggleFilter = () => {
    isFilterOpen.value = !isFilterOpen.value
    console.log('🔍 isFilterOpen:', isFilterOpen.value)
}

// 필터 클릭 핸들러
const handleFilterClick = (filter) => {
    if (filter.isCustom) {
        toggleFilter()
    } else {
        selectedFilter.value = filter.key
        isFilterOpen.value = false // 기존 드롭다운은 닫기
    }
}

const handleFavoriteChanged = (subscriptionId) => {
    const nowFavorite = favoritesStore.toggleFavorite(subscriptionId)
    console.log(`ID: ${subscriptionId}, 즐겨찾기 상태: ${nowFavorite}`)
}

const handleSortClick = (sortStandard) => {
    selectedFilter.value = sortStandard.key
    isFilterOpen.value = false
}

const handleFilterUpdate = ({ field, value }) => {
    if (field === 'selectedCity') selectedCity.value = value
    else if (field === 'selectedDistrict') selectedDistrict.value = value
    else if (field === 'selectedRegions') selectedRegions.value = value
    else if (field === 'selectedAreas') selectedAreas.value = value
    else if (field === 'priceMin') priceMin.value = value
    else if (field === 'priceMax') priceMax.value = value
}

onMounted(() => {
    favoritesStore.initializeFavorites()
})
</script>
