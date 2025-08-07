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
                    {{ appliedFilters.priceMin ? formatToEok(appliedFilters.priceMin) + '원' : '' }}
                    ~
                    {{ appliedFilters.priceMax ? formatToEok(appliedFilters.priceMax)+ '원' : '' }}
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
                    :key="subscription.pblanc_no"
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

const props = defineProps({
    showExpired: { type: Boolean, default: false }, // 기본은 false
})

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

// 필터 적용 부분
const applyFilters = () => {
    const parsedAreas = selectedAreas.value.map((val) =>
        typeof val === 'string' ? val.split(',').map(Number) : val,
    )
    appliedFilters.value = {
        regions: selectedRegions.value.map((r) => {
            if (typeof r === 'string') {
                const [city, district] = r.split(' ')
                return { city, district: district || '__all__' }
            }
            return r
        }),
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isExpired = (item) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const [, endRaw] = (item.application_period || '').split('~') || []
        const endDate = new Date((endRaw || '').trim().replace(/\./g, '-'))
        return endDate < today
    }

    // // 1. 마감 공고 제거 -> 테스트 시에는 마감 공고 제거 X
    // if (!props.showExpired) {
    //     result = result.filter((item) => {
    //         if (!item.application_period) return false
    //         const [, endStrRaw] = item.application_period.split('~') || []
    //         if (!endStrRaw) return false
    //         const endDate = new Date(endStrRaw.trim().replace(/\./g, '-'))
    //         return endDate >= today
    //     })
    // }

    // 2. 지역 필터
    if (appliedFilters.value.regions.length > 0) {
        result = result.filter((item) =>
            appliedFilters.value.regions.some((region) => {
                const city = item.city || ''
                const district = item.district || ''

                // city 이름 일부만 포함되어도 매칭되도록
                const cityMatch = city.includes(region.city)

                if (!region.district || region.district === '' || region.district === '__all__') {
                    return cityMatch
                }

                // district 이름도 유연하게 포함 여부 체크
                return cityMatch && district.includes(region.district)
            }),
        )
    }

    // 3. 면적 필터
    if (appliedFilters.value.squareMeters.length > 0) {
        result = result.filter((item) => {
            const min = Number(item.min_area) || 0
            const max = Number(item.max_area) || 0
            return appliedFilters.value.squareMeters.some(
                ([rangeMin, rangeMax]) => max >= rangeMin && min <= rangeMax,
            )
        })
    }

    // 4. 가격 필터
    if (appliedFilters.value.priceMin !== null || appliedFilters.value.priceMax !== null) {
        result = result.filter((item) => {
            const minP = parseFloat(item.min_price) || 0
            const maxP = parseFloat(item.max_price) || 0
            return (
                (appliedFilters.value.priceMin === null || maxP >= appliedFilters.value.priceMin) &&
                (appliedFilters.value.priceMax === null || minP <= appliedFilters.value.priceMax)
            )
        })
    }

    // 5. 정렬
    const parseEndDate = (period) => {
        if (!period) return new Date(0)
        const [, endRaw] = period.split('~') || []
        return new Date((endRaw || '').trim().replace(/\./g, '-'))
    }
    const parseStartDate = (period) => {
        if (!period) return new Date(0)
        const [startRaw] = period.split('~') || []
        return new Date((startRaw || '').trim().replace(/\./g, '-'))
    }

    result.sort((a, b) => {
        // 마감된 공고는 항상 뒤로, 나중에 삭제할 부분
        const aExpired = isExpired(a)
        const bExpired = isExpired(b)
        if (aExpired !== bExpired) {
            return aExpired ? 1 : -1
        }

        // 정렬 기준
        switch (selectedFilter.value) {
            case 'latest':
                return parseStartDate(a.application_period) - parseStartDate(b.application_period)
            case 'deadline-first':
                return parseEndDate(a.application_period) - parseEndDate(b.application_period)
            case 'recommend':
                return (parseFloat(b.max_price) || 0) - (parseFloat(a.max_price) || 0)
            default:
                return 0
        }
    })

    return result
})

const formatToEok = (priceValue) => {
    if (priceValue == null) return ''

    // 문자열이면 쉼표 제거
    let num = priceValue
    if (typeof priceValue === 'string') {
        num = parseFloat(priceValue.replace(/,/g, ''))
    }

    if (isNaN(num)) return ''

    // 서버 단위가 '만원'이므로 10,000으로 나눠야 '억' 단위가 됨
    const eok = num / 10000
    return `${eok.toFixed(1)}억`
}
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
    favoritesStore.getFavorite()
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
