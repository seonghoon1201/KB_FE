<template>
    <div class="bg-gray-50 min-h-screen pt-20">
        <!-- 상단 헤더 -->
        <BackHeader title="청약 상세" />

        <!-- 공고 기본 정보 -->
        <section class="bg-white px-4 pt-4 pb-6">
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-xl font-bold text-gray-900">{{ subscription.title }}</h1>
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
            <p class="text-sm text-gray-500">
                {{ subscription.type }} · {{ areaList }} · {{ subscription.householdCount }}세대
            </p>
            <p class="mt-1 text-sm text-gray-500">
                <MapPin class="inline mr-1" :size="16" />{{ subscription.address }}
            </p>
            <p class="mt-2 text-lg font-bold text-blue-600">{{ subscription.price }}</p>

            <!-- 지도 영역 -->
            <div ref="mapRef" class="rounded-lg mt-4 w-full aspect-video" />
        </section>

        <!-- 청약 일정 -->
        <section class="px-4 mt-4">
            <h2 class="text-base font-semibold mb-2">
                <Calendar class="inline mr-1" :size="18" /> 청약 일정
            </h2>
            <div class="bg-white rounded-xl border border-gray-200 p-4">
                <div
                    v-for="item in scheduleItems"
                    :key="item.label"
                    class="flex justify-between items-center py-1"
                >
                    <div>
                        <p class="text-sm text-gray-700 font-medium">{{ item.label }}</p>
                        <p class="text-xs text-gray-500">{{ item.date }}</p>
                    </div>
                    <span
                        v-if="item.badge"
                        :class="[
                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                            badgeColor(item.badge),
                        ]"
                    >
                        {{ item.badge }}
                    </span>
                </div>
            </div>
        </section>

        <!-- 나의 순위 -->
        <section class="px-4 mt-6">
            <RankSection />
        </section>

        <!-- 나의 당첨 가능성 -->
        <section class="px-4 mt-6">
            <PossibilitySection />
        </section>

        <!-- 버튼 그룹 -->
        <section class="px-4 mt-6 space-y-3">
            <!-- 청약 신청 버튼 -->
            <button
                class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl py-3 text-base font-semibold shadow hover:brightness-110 transition-all"
            >
                <Building2 class="w-5 h-5" /> 청약 신청하기
            </button>
            <p class="text-xs text-gray-400 text-center">* 청약Home 사이트로 이동합니다.</p>

            <!-- 분양 정보 보기 버튼 -->
            <button
                class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl py-3 text-base font-semibold shadow hover:brightness-110 transition-all"
            >
                <FileText class="w-5 h-5" /> 분양 정보 보기
            </button>
            <p class="text-xs text-gray-400 text-center">* 분양 정보 페이지로 이동합니다.</p>
        </section>

        <!-- 주변 시설 -->
        <section class="px-4 mt-6">
            <div v-for="group in facilityGroups" :key="group.title" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <component :is="group.icon" :size="16" :class="group.color" />
                    <span>{{ group.title }}</span>
                </h3>
                <div class="space-y-2">
                    <div
                        v-for="item in group.items"
                        :key="item.name"
                        class="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3"
                    >
                        <component :is="group.icon" :size="18" :class="group.color" />
                        <div>
                            <p class="text-sm font-medium text-gray-800">{{ item.name }}</p>
                            <p class="text-xs text-gray-500">{{ item.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import {
    Heart,
    MapPin,
    Calendar,
    TrainFront,
    GraduationCap,
    Stethoscope,
    ShoppingBag,
    FileText,
    Building2,
} from 'lucide-vue-next'
import { onMounted, ref, computed } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import PossibilitySection from '@/components/SubDetail/PossibilitySection.vue'
import RankSection from '@/components/SubDetail/RankSection.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { loadKakaoMapScript } from '@/utils/KakaoMapLoader'

const mapRef = ref(null)

onMounted(async () => {
    const kakao = await loadKakaoMapScript()

    const map = new kakao.maps.Map(mapRef.value, {
        center: new kakao.maps.LatLng(subscription.lat, subscription.lng),
        level: 4,
    })

    new kakao.maps.Marker({
        position: new kakao.maps.LatLng(subscription.lat, subscription.lng),
        map: map,
    })
})

// 임시 subscription 데이터
const subscription = {
    id: 1,
    title: '힐스테이트',
    type: '아파트',
    area: ['59', '74', '84'],
    householdCount: 175,
    address: '서울시 강남구 역삼동 123-45',
    price: '7억',
    lat: 37.50098, // 위도
    lng: 127.03654, // 경도
}

// 다중 평수를 문자열로 포맷
const areaList = computed(() => subscription.area.map((a) => `${a}㎡`).join(' / '))

const scheduleItems = [
    { label: '특별공급', date: '2025.07.15 ~ 2025.07.17', badge: '마감' },
    { label: '1순위 해당 지역', date: '2025.07.18 ~ 2025.07.20', badge: '진행중' },
    { label: '1순위 기타 지역', date: '2025.07.21 ~ 2025.07.22', badge: 'D-1' },
    { label: '2순위 해당 지역', date: '2025.07.23 ~ 2025.07.24', badge: 'D-3' },
    { label: '2순위 기타 지역', date: '2025.07.25 ~ 2025.07.26', badge: 'D-5' },
]

function badgeColor(label) {
    switch (label) {
        case '진행중':
            return 'bg-orange-100 text-orange-600'
        case '마감':
            return 'bg-gray-100 text-gray-500'
        case 'D-1':
        case 'D-3':
        case 'D-5':
            return 'bg-blue-100 text-blue-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const facilityGroups = [
    {
        title: '교통',
        icon: TrainFront,
        color: 'text-green-600',
        items: [
            { name: '역삼역', desc: '2호선 · 도보 5분' },
            { name: '강남역', desc: '2호선 · 도보 12분' },
            { name: '역삼역 버스정류장', desc: '146, 401, 402 · 도보 3분' },
        ],
    },
    {
        title: '교육 시설',
        icon: GraduationCap,
        color: 'text-purple-600',
        items: [
            { name: '역삼초등학교', desc: '초등학교 · 도보 5분' },
            { name: '개포중학교', desc: '중학교 · 도보 15분' },
            { name: '개포고등학교', desc: '고등학교 · 도보 18분' },
        ],
    },
    {
        title: '의료 시설',
        icon: Stethoscope,
        color: 'text-red-500',
        items: [
            { name: '강남세브란스병원', desc: '종합병원 · 도보 10분' },
            { name: '역삼내과의원', desc: '내과 · 도보 5분' },
            { name: '강남치과', desc: '치과 · 도보 7분' },
        ],
    },
    {
        title: '편의 시설',
        icon: ShoppingBag,
        color: 'text-orange-500',
        items: [
            { name: '강남역 지하상가', desc: '쇼핑몰 · 도보 12분' },
            { name: '이마트 역삼점', desc: '대형마트 · 도보 6분' },
            { name: 'GS25 역삼점', desc: '편의점 · 도보 2분' },
        ],
    },
]

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(subscription.id))

const handleFavoriteClick = () => {
    favoritesStore.toggleFavorite(subscription.id)
}

const openPromotionLink = () => {
    window.open('https://www.applyhome.co.kr/co/coa/selectMainView.do', '_blank')
}
</script>
