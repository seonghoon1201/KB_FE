<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- 헤더: 뒤로 가기 버튼과 페이지 제목 -->
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
                    <!-- 정렬 아이콘 -->
                    <component :is="sortStandard.icon" class="w-4 h-4" />
                    <span>{{ sortStandard.label }}</span>
                </button>
            </div>

            <!-- 오른쪽 끝 필터 버튼 -->
            <button
                @click="toggleFilter"
                class="ml-auto z-10 flex items-center gap-1 px-3 py-2 rounded-full text-sm text-black-600 bg-gray-100 hover:bg-gray-200 transition-colors"
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
            <div v-if="filteredSubscriptions.length === 0" class="text-center py-12">
                <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
            </div>

            <!-- 공고 리스트: SubscriptionCard 컴포넌트 반복 -->
            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in filteredSubscriptions.slice(0, scrollIdx)"
                    :key="subscription.id"
                    :subscription="subscription"
                    :favorite-default="favoritesStore.favoriteIds.has(subscription.id)"
                    @favorite-changed="(id) => favoritesStore.toggleFavorite(id)"
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
// Vue Composition API 불러오기
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 공통 컴포넌트 불러오기
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import BackHeader from '@/components/common/BackHeader.vue'
// 더미 데이터 및 Pinia 스토어
// import { allSubscriptions } from '@/data/subscription-data'
import { allSubscriptions } from '@/data/subscription-large-data'
import { useFavoritesStore } from '@/stores/favorites'
// 정렬 및 필터 아이콘
import { TrendingUp, Clock, ArrowDownWideNarrow, SquareUser, ListFilter } from 'lucide-vue-next'
// 지역 데이터와 필터 모달
import { districts } from '@/data/districts'
import SubscriptionFilterModal from '@/components/modal/SubscriptionFilterModal.vue'

// 즐겨찾기 스토어 초기화
const favoritesStore = useFavoritesStore()
// 전체 공고 목록
const subscriptions = ref(allSubscriptions)
// 선택된 정렬 기준 (latest 또는 deadline-first)
const selectedFilter = ref('latest')
// 필터 모달 열림 상태
const isFilterOpen = ref(false)

// 필터 데이터 초기값
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const priceMin = ref(null)
const priceMax = ref(null)

// 스크롤 위치에 따른 "맨 위로" 버튼 표시 여부
const showScrollTop = ref(false)

const scrollIdx = ref(5)

// 정렬 기준 정의
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

// 평수 토글 함수
const toggleArea = (val) => {
    const valStr = val.toString()
    const exists = selectedAreas.value.some((a) => a.toString() === valStr)
    if (exists) {
        selectedAreas.value = selectedAreas.value.filter((a) => a.toString() !== valStr)
    } else {
        selectedAreas.value.push([...val]) // 깊은 복사해서 추가
    }
}

// 필터링 및 정렬 적용된 공고 목록 계산
const filteredSubscriptions = computed(() => {
    let result = [...subscriptions.value]

    // 정렬 처리
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

    // 지역 필터 적용
    if (appliedFilters.value.regions.length > 0) {
        result = result.filter((item) =>
            appliedFilters.value.regions.some((region) => {
                // 군/구 선택이 없으면 city만 비교
                if (!region.district || region.district === '' || region.district === '__all__') {
                    return item.city === region.city
                }
                return item.city === region.city && item.district === region.district
            }),
        )
    }

    // 평수 필터 적용
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

    // 가격 필터 적용
    if (appliedFilters.value.priceMin !== null || appliedFilters.value.priceMax !== null) {
        result = result.filter((item) => {
            const price = stringPriceToNumber(item.price) / 10000
            return (
                (appliedFilters.value.priceMin === null ||
                    price >= appliedFilters.value.priceMin) &&
                (appliedFilters.value.priceMax === null || price <= appliedFilters.value.priceMax)
            )
        })
    }

    return result
})

// 필터 적용 버튼 클릭 시 동작
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

    // 모달 닫기
    isFilterOpen.value = false
}

// 가격 문자열을 숫자로 변환하는 헬퍼 함수
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
    if (!isFilterOpen.value) {
        // 열 때 초기화
        selectedRegions.value = []
        selectedAreas.value = []
        priceMin.value = null
        priceMax.value = null
    }
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

// 필터 창을 열 때 현재 적용된 값으로 초기화
const openFilter = () => {
    tempFilters.value = JSON.parse(JSON.stringify(appliedFilters.value))
}

const handleFavoriteChanged = (subscriptionId) => {
    const nowFavorite = favoritesStore.toggleFavorite(subscriptionId)
    console.log(`ID: ${subscriptionId}, 즐겨찾기 상태: ${nowFavorite}`)
}

const handleSortClick = (sortStandard) => {
    selectedFilter.value = sortStandard.key
    isFilterOpen.value = false
}

// 필터 모달에서 개별 필드 업데이트
const handleFilterUpdate = ({ field, value }) => {
    if (field === 'selectedCity') selectedCity.value = value
    else if (field === 'selectedDistrict') selectedDistrict.value = value
    else if (field === 'selectedRegions') selectedRegions.value = value
    else if (field === 'selectedAreas') selectedAreas.value = value
    else if (field === 'priceMin') priceMin.value = value
    else if (field === 'priceMax') priceMax.value = value
}

// 활성화된 필터가 있는지 여부 계산
const hasActiveFilters = computed(() => {
    return (
        appliedFilters.value.regions.length > 0 ||
        appliedFilters.value.squareMeters.length > 0 ||
        appliedFilters.value.priceMin !== null ||
        appliedFilters.value.priceMax !== null
    )
})

// 개별 필터 제거 함수
const removeFilter = (type, index) => {
    if (type === 'region') {
        appliedFilters.value.regions.splice(index, 1)
    } else if (type === 'area') {
        appliedFilters.value.squareMeters.splice(index, 1)
    } else if (type === 'price') {
        appliedFilters.value.priceMin = null
        appliedFilters.value.priceMax = null
    }
}

// 스크롤 이벤트 핸들러: 스크롤 위치에 따라 top 버튼 표시
const handleScroll = () => {
    showScrollTop.value = window.scrollY > 200

    const { scrollY, innerHeight } = window
    const fullH = document.documentElement.scrollHeight
    if (scrollY + innerHeight >= fullH - 10) {
        scrollIdx.value += 5
    }
}

// 맨 위로 스크롤 함수
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 컴포넌트 마운트 시 즐겨찾기 초기화 및 스크롤 이벤트 등록
onMounted(() => {
    favoritesStore.initializeFavorites()
    window.addEventListener('scroll', handleScroll)
})

// 컴포넌트 언마운트 시 스크롤 이벤트 해제
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
