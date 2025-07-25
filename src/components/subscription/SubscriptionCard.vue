<!-- 청약 공고 카드 컴포넌트 -->
<template>
    <div
        class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
        <!-- 상단: 제목, D-Day, 하트 -->
        <div class="flex items-start justify-between mb-2">
            <h2 class="text-lg font-bold text-gray-900 flex-1 pr-4">
                {{ subscription.title }}
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

        <!-- 위치 정보 -->
        <p class="text-gray-500 text-sm mb-2 text-left">{{ subscription.city }} {{ subscription.district }}</p>

        <!-- 하단: 날짜, 타입, 버튼들 -->
        <div class="flex items-end justify-between">
            <!-- 좌측: 날짜와 타입 -->
            <div class="flex flex-col gap-4">
                <span class="text-gray-500 text-sm">
                    {{ subscription.applicationStartDate }} -
                    {{ subscription.applicationCompleteDate }}
                </span>
                <!-- 주택 타입 배지 -->
                <span
                    :class="houseTypeBadgeClass"
                    class="text-sm font-medium px-3 py-1 rounded-full w-fit"
                >
                    {{ subscription.type }}
                </span>
            </div>

            <!-- 우측: 면적/가격, 상세보기 버튼 -->
            <div class="flex flex-col gap-2 items-end">
                <!-- 면적, 가격 -->
                <span class="text-gray-500 text-sm">
                    {{ subscription.squareMeters }}㎡ · <span>{{ formatToEok(subscription.price) }}</span>
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

const isFavorite = computed(() => favoritesStore.isFavorite(props.subscription.id))

// D-Day 계산 (computed)
const dDayInfo = computed(() => {
    const { applicationCompleteDate } = props.subscription
    if (!applicationCompleteDate) return { dDay: 0, text: 'D-Day' }

    // 날짜 파싱
    const formattedDate = applicationCompleteDate.replace(/\./g, '-')
    const endDate = new Date(formattedDate)
    const today = new Date()

    // 시간 제거하고 날짜만 비교
    today.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
        return { dDay: diffDays, text: `D-${diffDays}` }
    } else if (diffDays === 0) {
        return { dDay: 0, text: 'D-DAY' }
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
    const type = props.subscription.type
    const styleMap = {
        아파트: 'bg-blue-50 text-blue-700 border border-blue-200',
        '도시형 생활주택': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        오피스텔: 'bg-red-50 text-red-700 border border-red-200',
    }
    return styleMap[type] || 'bg-gray-100 text-gray-700'
})

// 이벤트 emit
const emit = defineEmits(['favorite-changed', 'detail-click'])

// 즐겨찾기 토글
const handleFavoriteClick = () => {
    const result = favoritesStore.toggleFavorite(props.subscription.id)
    isFavorite.value = result
}

// 상세보기 클릭
const handleDetailClick = () => {
  router.push(`/subscriptions/${props.subscription.id}`)
}

const formatToEok = (priceStr) => {
  if (!priceStr) return ''

  // 1. 쉼표 제거 → 문자열 → 숫자
  const number = parseInt(priceStr.replace(/,/g, ''), 10)

  if (isNaN(number)) return ''

  // 2. 억 단위로 환산 (1억 = 100,000,000)
  const eok = number / 100000000

  // 3. 소수점 1자리로 포맷
  return `${eok.toFixed(1)}억`
}
</script>
