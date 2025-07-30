<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- 헤더: 뒤로 가기 버튼과 페이지 제목 -->
        <BackHeader title="청약 공고" />

        <!-- 필터 버튼들 (옵셔널) -->
        <div
            class="px-4 py-3 bg-white border-b border-gray-100 z-20 flex justify-between items-center"
        >
            <!-- 정렬 기준 버튼 -->
            <div class="relative">
                <button
                    @click="toggleSortMenu"
                    class="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-500 transition"
                >
                    <component
                        :is="sortStandards.find((s) => s.key === selectedFilter)?.icon"
                        class="w-4 h-4"
                    />
                    <span>{{ sortStandards.find((s) => s.key === selectedFilter)?.label }}</span>
                    <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- 드롭다운 메뉴 -->
                <div
                    v-if="showSortMenu"
                    class="absolute left-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-lg w-40 z-20 overflow-hidden"
                >
                    <button
                        v-for="sortStandard in sortStandards"
                        :key="sortStandard.key"
                        @click="handleSortClick(sortStandard)"
                        :class="[
                            'w-full text-left px-4 py-2 text-sm transition',
                            selectedFilter === sortStandard.key
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'hover:bg-gray-100',
                        ]"
                    >
                        <div class="flex items-center gap-2">
                            <component :is="sortStandard.icon" class="w-4 h-4" />
                            <span>{{ sortStandard.label }}</span>
                        </div>
                    </button>
                </div>
            </div>

            <!-- 필터 버튼 -->
            <button
                @click="toggleFilter"
                class="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
                <ListFilter class="w-4 h-4" />
                <span class="text-sm font-medium">필터</span>
            </button>
        </div>
        <hr />
        <!-- 필터 요약 뱃지: 활성화된 필터가 있을 때 표시 -->
        <div
            v-if="hasActiveFilters"
            class="flex flex-wrap gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm text-gray-700"
        >
            <!-- 지역 필터 -->
            <span v-for="(region, index) in appliedFilters.regions" :key="'region-' + index">
                <div class="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <span>
                        {{ region.city }}
                        {{ region.district === '__all__' ? '전체' : region.district }}
                    </span>
                    <button class="ml-1 font-bold" @click="removeFilter('region', index)">✕</button>
                </div>
            </span>

            <!-- 평수 필터 -->
            <span v-for="(range, index) in appliedFilters.squareMeters" :key="'area-' + index">
                <div class="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <span>{{ range[0] }}~{{ range[1] }}㎡</span>
                    <button class="ml-1 font-bold" @click="removeFilter('area', index)">✕</button>
                </div>
            </span>

            <!-- 가격 필터 -->
            <div
                v-if="appliedFilters.priceMin || appliedFilters.priceMax"
                class="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"
            >
                <span>
                    {{ appliedFilters.priceMin ? appliedFilters.priceMin + '만원' : '' }}
                    ~
                    {{ appliedFilters.priceMax ? appliedFilters.priceMax + '만원' : '' }}
                </span>
                <button class="ml-1 font-bold" @click="removeFilter('price')">✕</button>
            </div>
        </div>

        <!-- 🔽 필터 모달 컴포넌트 -->
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
            <div v-if="finalSubscriptions.length === 0" class="text-center py-12">
                <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
            </div>

            <!-- 공고 리스트: SubscriptionCard 컴포넌트 반복 -->
            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in finalSubscriptions.slice(0, scrollIdx)"
                    :key="subscription.house_nm"
                    :subscription="subscription"
                />
            </div>
        </div>

        <BottomNavbar />

        <!-- 🔝 맨 위로 이동 버튼 -->
        <button
            v-show="showScrollTop"
            class="fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow transition"
            @click="scrollToTop"
        >
            <ArrowUp class="w-5 h-5" />
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useSubscriptionsStore } from '@/stores/subscription'
import { useFavoritesStore } from '@/stores/favorites'
import { TrendingUp, Clock, ListFilter, ThumbsUp } from 'lucide-vue-next'
import SubscriptionFilterModal from '@/components/modal/SubscriptionFilterModal.vue'

const route = useRoute()
const subscriptionsStore = useSubscriptionsStore()
const favoritesStore = useFavoritesStore()

const selectedFilter = ref('latest')
const isFilterOpen = ref(false)
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const priceMin = ref(null)
const priceMax = ref(null)
const showScrollTop = ref(false)
const scrollIdx = ref(5)
const showSortMenu = ref(false)

const appliedFilters = ref({
    regions: [],
    squareMeters: [],
    priceMin: null,
    priceMax: null,
})
const selectedAreas = ref([])

const sortStandards = [
    { key: 'latest', label: '최신순', icon: TrendingUp },
    { key: 'deadline-first', label: '마감임박순', icon: Clock },
    { key: 'recommend', label: '추천순', icon: ThumbsUp },
]

// --- UI 핸들러 ---
const toggleSortMenu = () => (showSortMenu.value = !showSortMenu.value)
const handleSortClick = (sortStandard) => {
    selectedFilter.value = sortStandard.key
    showSortMenu.value = false
}
const toggleFilter = () => {
    if (!isFilterOpen.value) {
        // 기존 값 유지
        selectedRegions.value = [...appliedFilters.value.regions]
        selectedAreas.value = [...appliedFilters.value.squareMeters]
        priceMin.value = appliedFilters.value.priceMin
        priceMax.value = appliedFilters.value.priceMax
        selectedCity.value = ''
        selectedDistrict.value = ''
    }
    isFilterOpen.value = !isFilterOpen.value
}
const handleFilterUpdate = ({ field, value }) => {
    if (field === 'selectedCity') selectedCity.value = value
    else if (field === 'selectedDistrict') selectedDistrict.value = value
    else if (field === 'selectedRegions') selectedRegions.value = value
    else if (field === 'selectedAreas') selectedAreas.value = value
    else if (field === 'priceMin') priceMin.value = value
    else if (field === 'priceMax') priceMax.value = value
}
const removeFilter = (type, index) => {
    if (type === 'region') appliedFilters.value.regions.splice(index, 1)
    else if (type === 'area') appliedFilters.value.squareMeters.splice(index, 1)
    else if (type === 'price') {
        appliedFilters.value.priceMin = null
        appliedFilters.value.priceMax = null
    }
}
const applyFilters = () => {
    const parsedAreas = selectedAreas.value.map((val) =>
        typeof val === 'string' ? val.split(',').map(Number) : val,
    )
    appliedFilters.value = {
        regions: [...selectedRegions.value],
        squareMeters: parsedAreas,
        priceMin: priceMin.value,
        priceMax: priceMax.value,
    }
    isFilterOpen.value = false
}

// --- 최종 목록 계산 ---
const finalSubscriptions = computed(() => {
    if (!subscriptionsStore.subscriptions || subscriptionsStore.subscriptions.length === 0)
        return []

    let result = [...subscriptionsStore.subscriptions]

    // 1. 정렬
    switch (selectedFilter.value) {
        case 'latest':
            result.sort((a, b) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const endA = new Date(a.application_end_date)
                const endB = new Date(b.application_end_date)
                const startA = new Date(a.application_start_date)
                const startB = new Date(b.application_start_date)

                const isExpiredA = endA < today
                const isExpiredB = endB < today

                if (isExpiredA && !isExpiredB) return 1
                if (!isExpiredA && isExpiredB) return -1

                return startA - startB
            })
            break
        case 'deadline-first':
            result.sort(
                (a, b) => new Date(a.application_end_date) - new Date(b.application_end_date),
            )
            break
        case 'recommend':
            // 임시로 가격순 정렬
            result.sort(
                (a, b) =>
                    (parseFloat(b.lttot_top_amount) || 0) - (parseFloat(a.lttot_top_amount) || 0),
            )
            break
    }

    // 2. 필터 - 지역
    if (appliedFilters.value.regions.length > 0) {
        result = result.filter((item) =>
            appliedFilters.value.regions.some((region) => {
                const addr = item.hssply_adres || ''
                const cityMatch = addr.includes(region.city)
                if (!region.district || region.district === '' || region.district === '__all__') {
                    return cityMatch
                }
                return cityMatch && addr.includes(region.district)
            }),
        )
    }

    // 3. 필터 - 면적
    if (appliedFilters.value.squareMeters.length > 0) {
        result = result.filter((item) => {
            const m2 = Number(item.suply_ar)
            return appliedFilters.value.squareMeters.some(([min, max]) => m2 >= min && m2 <= max)
        })
    }

    // 4. 필터 - 가격
    if (appliedFilters.value.priceMin !== null || appliedFilters.value.priceMax !== null) {
        result = result.filter((item) => {
            const price = (parseFloat(item.lttot_top_amount) || 0) 
            return (
                (appliedFilters.value.priceMin === null ||
                    price >= appliedFilters.value.priceMin) &&
                (appliedFilters.value.priceMax === null || price <= appliedFilters.value.priceMax)
            )
        })
    }

    // 5. 그룹화
    const map = new Map()
    result.forEach((item) => {
        const key = item.house_nm
        const suplyAr = parseFloat(item.suply_ar) || 0
        const amount = parseFloat(String(item.lttot_top_amount).replace(/,/g, '')) || 0

        if (!map.has(key)) {
            map.set(key, {
                house_nm: item.house_nm,
                house_type: item.house_type,
                city: item.city,
                district: item.district,
                hssply_adres: item.hssply_adres,
                start_date: item.application_start_date,
                end_date: item.application_end_date,

                suply_ar_sum: suplyAr,
                lttot_top_amount_sum: amount,
                count: 1,
            })
        } else {
            const obj = map.get(key)
            // 날짜 업데이트
            if (item.application_start_date && obj.start_date > item.application_start_date)
                obj.start_date = item.application_start_date
            if (item.application_end_date && obj.end_date < item.application_end_date)
                obj.end_date = item.application_end_date

            // 누적
            obj.suply_ar_sum += suplyAr
            obj.lttot_top_amount_sum += amount
            obj.count += 1
        }
    })

    // 평균값 계산해서 반환
    return Array.from(map.values()).map((obj) => {
        const avgSuplyAr = obj.suply_ar_sum / obj.count
        const avgAmount = obj.lttot_top_amount_sum / obj.count

        return {
            ...obj,
            application_start_date: obj.start_date,
            application_end_date: obj.end_date,
            application_period: `${obj.start_date} ~ ${obj.end_date}`,
            suply_ar: avgSuplyAr.toFixed(0),
            lttot_top_amount: avgAmount, // 정수화
        }
    })
})

// --- 스크롤 / 초기화 ---
const hasActiveFilters = computed(
    () =>
        appliedFilters.value.regions.length > 0 ||
        appliedFilters.value.squareMeters.length > 0 ||
        appliedFilters.value.priceMin !== null ||
        appliedFilters.value.priceMax !== null,
)

const handleScroll = () => {
    showScrollTop.value = window.scrollY > 200
    const { scrollY, innerHeight } = window
    const fullH = document.documentElement.scrollHeight
    if (scrollY + innerHeight >= fullH - 10) {
        scrollIdx.value += 5
    }
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
    if (route.query.sort === 'recommend') {
        selectedFilter.value = 'recommend'
    }
    subscriptionsStore.fetchSubscriptions()
    favoritesStore.initializeFavorites()
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
