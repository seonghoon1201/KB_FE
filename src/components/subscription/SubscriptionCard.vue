<!-- 청약 공고 카드 컴포넌트 -->
<template>
    <div
        class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
        <!-- 상단: 제목, D-Day, 하트 -->
        <div class="flex items-start justify-between mb-2">
            <h2 class="text-lg font-bold text-gray-900 pr-4 truncate whitespace-nowrap">
                {{ subscription.house_nm }}
            </h2>
            <div class="flex items-center gap-2 flex-shrink-0">
                <!-- D-Day 배지 -->
                <span :class="dDayBadgeClass" class="text-xs font-semibold px-3 py-1 rounded-md">
                    {{ dDayText }}
                </span>
                <!-- 하트 아이콘 -->
                <button
                    @click="handleFavoriteClick"
                    class="p-1 hover:bg-gray-50 rounded-full transition-colors duration-200"
                >
                    <Heart
                        :size="24"
                        :fill="isFavorite ? '#ef4444' : 'none'"
                        :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
                        stroke-width="1.5"
                    />
                </button>
            </div>
        </div>

        <!-- 하단: 날짜, 타입, 버튼들 -->
        <div class="flex items-end justify-between">
            <!-- 좌측: 날짜와 타입 -->
            <div class="flex flex-col gap-3">
                <!-- 위치 정보 -->
                <p class="text-gray-500 text-sm text-left">
                    {{ subscription.city }} {{ subscription.district }}
                </p>
                <!-- 모집 기간 -->
                <span v-if="subscription.application_start_date" class="text-gray-500 text-sm">
                    {{ subscription.application_start_date }} ~
                    {{ subscription.application_end_date }}
                </span>
                <span v-else-if="subscription.application_period" class="text-gray-500 text-sm">
                    {{ subscription.application_period }}
                </span>
                <!-- 주택 타입 배지 -->
                <span
                    :class="houseTypeBadgeClass"
                    class="text-sm font-medium px-3 py-1 rounded-full w-fit"
                >
                    {{ houseTypeLabel }}
                </span>
            </div>

            <!-- 우측: 면적/가격, 상세보기 버튼 -->
            <div class="flex flex-col items-end">
                <span class="text-gray-500 text-sm mr-2">
                    {{ formatToEok(subscription.min_price) }} ~
                </span>
                <!-- 면적, 가격 -->
                <span class="text-gray-500 text-sm mt-2 mb-3 mr-2">
                    {{ formatToNum(subscription.min_area) }}㎡ ~
                </span>
                <!-- 상세보기 버튼 -->
                <button
                    @click="handleDetailClick"
                    class="bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    상세보기
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'

import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()
const router = useRouter()

// Props 정의
const props = defineProps({
    subscription: {
        type: Object,
        required: true,
    },
    favoriteDefault: {
        type: Boolean,
        default: false,
    },
})

const isFavorite = computed(() => {
    if (!favoritesStore.favorites || !Array.isArray(favoritesStore.favorites)) return false
    else
        return favoritesStore.isFavorite(
            props.subscription.house_type,
            props.subscription.pblanc_no,
        )
})

// D-Day 계산 (computed)
const dDayInfo = computed(() => {
    const period = props.subscription.application_period
    if (!period) return { dDay: 0, text: '오늘 마감' }

    // "2025.08.04 ~ 2025.08.06" 에서 끝 날짜 부분만 가져오기
    const parts = period.split('~')
    if (parts.length < 2) return { dDay: 0, text: '오늘 마감' }

    // // 날짜 없으면 기본값
    // if (!end) return { dDay: 0, text: '일정없음' }

    const endDateStr = parts[1].trim().replace(/\./g, '-') // "2025-08-06"
    const endDate = new Date(endDateStr)
    const today = new Date()

    // 시간 0시로 맞춰서 날짜만 비교
    today.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
        return { dDay: diffDays, text: `D-${diffDays}` }
    } else if (diffDays === 0) {
        return { dDay: 0, text: '오늘 마감' }
    } else {
        return { dDay: diffDays, text: '마감' }
    }
})

// D-Day 텍스트
const dDayText = computed(() => dDayInfo.value.text)

// D-Day 배지 스타일
const dDayBadgeClass = computed(() => {
    const dDay = dDayInfo.value.dDay
    if (dDay > 7) return 'bg-blue-100 text-blue-700'
    if (dDay > 3) return 'bg-yellow-100 text-yellow-700'
    if (dDay >= 0) return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
})

// 주택 타입 배지 스타일
const houseTypeBadgeClass = computed(() => {
    const type = props.subscription.house_type
    const styleMap = {
        APT: 'bg-blue-50 text-blue-700 border border-blue-200',
        도시형생활주택: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        오피스텔: 'bg-red-50 text-red-700 border border-red-200',
    }
    return styleMap[type] || 'bg-gray-100 text-gray-700 border border-gray-200'
})

// 주택 타입 표시 텍스트
const houseTypeLabel = computed(() => {
    const type = props.subscription.house_type
    const labelMap = {
        APT: '아파트',
        도시형생활주택: '도시형 생활주택',
        오피스텔: '오피스텔',
    }
    return labelMap[type] || type
})

// 이벤트 emith
const emit = defineEmits(['favorite-changed', 'detail-click'])

const handleFavoriteClick = () => {
    const { house_type, pblanc_no } = props.subscription
    if (favoritesStore.isFavorite(house_type, pblanc_no)) {
        favoritesStore.removeFavorite({ house_type, pblanc_no })
    } else {
        favoritesStore.addFavorite({ house_type, pblanc_no })
    }
}

const handleDetailClick = () => {
    const { pblanc_no, house_type } = props.subscription
    if (house_type === 'APT' || house_type === '신혼희망타운') {
        router.push(`/subscriptions/${pblanc_no}`)
    } else {
        router.push(`/etcsubscriptions/${pblanc_no}`)
    }
}

const formatToNum = (strValue) => {
    if (strValue == null || strValue === '') return 0 // null/빈 문자열 처리

    const num = parseFloat(strValue)
    if (isNaN(num)) return 0 // 숫자로 변환 불가하면 0

    return parseFloat(num.toFixed(1)) // 소수점 첫째자리까지
}

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

</script>
