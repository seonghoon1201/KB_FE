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

        <!-- 🔽 필터 드롭다운 -->
        <div v-if="isFilterOpen" class="px-4 pt-4 pb-2 bg-white border-b border-gray-100">
            <label class="text-sm font-semibold text-gray-800 mb-1 block"
                >선호 지역 (복수 선택 가능)</label
            >

            <div class="space-y-2">
                <select v-model="selectedCity" class="w-full border rounded px-3 py-2 text-sm">
                    <option disabled value="">시/도를 선택해주세요</option>
                    <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>

                <select
                    v-model="selectedDistrict"
                    class="w-full border rounded px-3 py-2 text-sm"
                    @change="addSelectedRegion"
                >
                    <option disabled value="">군/구를 선택해주세요</option>
                    <option v-for="gu in filteredDistricts" :key="gu">{{ gu }}</option>
                </select>
            </div>

            <!-- 선택된 지역 태그 -->
            <div v-if="selectedRegions.length > 0" class="mt-3 flex flex-wrap gap-2 text-xs">
                <div
                    v-for="(region, index) in selectedRegions"
                    :key="index"
                    class="flex items-center bg-[#E8EAFE] text-[#5A78FF] px-2 py-1 rounded-full"
                >
                    <span>{{ region.city }} {{ region.district }}</span>
                    <button
                        @click="removeSelectedRegion(index)"
                        class="ml-1 text-[#5A78FF] font-bold"
                    >
                        ✕
                    </button>
                </div>
                <span class="text-gray-400 ml-2">{{ selectedRegions.length }}개 선택됨</span>
            </div>

            <!-- 선호 평수 -->
            <div class="mb-5">
                <label class="text-sm font-semibold text-gray-800 block mt-3 mb-1"
                    >선호 평수 (복수 선택 가능)</label
                >
                <div class="grid grid-cols-3 gap-2 text-sm">
                    <button
                        v-for="option in areaOptions"
                        :key="option.value"
                        @click="toggleArea(option.value)"
                        :class="[
                            'px-3 py-2 rounded-full border',
                            selectedAreas.includes(option.value)
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600',
                        ]"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- 희망 가격대 -->
            <div class="mb-5">
                <label class="text-sm font-semibold text-gray-800 block mb-2"
                    >희망 가격대 (만원 단위)</label
                >
                <div class="flex items-center gap-2">
                    <input
                        v-model.number="priceMin"
                        type="number"
                        class="w-full border rounded px-3 py-2 text-sm"
                        placeholder="최소 금액"
                    />
                    <span class="text-gray-500">~</span>
                    <input
                        v-model.number="priceMax"
                        type="number"
                        class="w-full border rounded px-3 py-2 text-sm"
                        placeholder="최대 금액"
                    />
                </div>
            </div>

            <!-- 필터 적용 버튼 -->
            <div class="text-center mt-4">
                <button
                    @click="applyFilters"
                    class="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600"
                >
                    필터 적용
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
import { districts } from '@/data/districts'
import { areaOptions } from '@/data/area'

const favoritesStore = useFavoritesStore()

const subscriptions = ref(allSubscriptions)

const selectedFilter = ref('latest')

const isFilterOpen = ref(false)

const filters = [
    { key: 'latest', label: '최신순', icon: TrendingUp },
    { key: 'deadline-first', label: '마감임박순', icon: Clock },
    { key: 'filter', label: '필터', icon: ArrowDownWideNarrow, isCustom: true },
]

const appliedFilters = ref({
    regions: [],
    areas: [],
    priceMin: null,
    priceMax: null,
})

const cities = Object.keys(districts)
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const priceMin = ref(null) // 만 원 단위
const priceMax = ref(null)

const showCustomFilter = ref(false)

const filteredDistricts = computed(() => districts[selectedCity.value] || [])

const addSelectedRegion = () => {
    if (!selectedCity.value || !selectedDistrict.value) return
    const duplicate = selectedRegions.value.some(
        (item) => item.city === selectedCity.value && item.district === selectedDistrict.value,
    )
    if (!duplicate) {
        selectedRegions.value.push({ city: selectedCity.value, district: selectedDistrict.value })
    }
    selectedDistrict.value = ''
}

const removeSelectedRegion = (index) => {
    selectedRegions.value.splice(index, 1)
}

const customFilter = ref({
    location: '',
    area: '',
    price: '',
})

const selectedAreas = ref([])
const toggleArea = (val) => {
    const key = val.toString()
    const exists = selectedAreas.value.find((a) => a.toString() === key)
    if (exists) {
        selectedAreas.value = selectedAreas.value.filter((a) => a.toString() !== key)
    } else {
        selectedAreas.value.push(val)
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
    if (appliedFilters.value.areas.length > 0) {
        result = result.filter((item) => {
            const area = item.area // 숫자형이어야 함
            return appliedFilters.value.areas.some(([min, max]) => area >= min && area < max)
        })
    }

    // 가격 필터
    if (appliedFilters.value.priceMin !== null || appliedFilters.value.priceMax !== null) {
        result = result.filter((item) => {
            const price = item.price
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
    appliedFilters.value = {
        regions: [...selectedRegions.value],
        areas: [...selectedAreas.value],
        priceMin: priceMin.value,
        priceMax: priceMax.value,
    }
    isFilterOpen.value = false // 필터 창 닫기
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

onMounted(() => {
    favoritesStore.initializeFavorites()
})
</script>
