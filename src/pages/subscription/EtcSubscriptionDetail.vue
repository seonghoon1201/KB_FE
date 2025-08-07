<template>
    <div class="bg-gray-50 min-h-screen pt-12">
        <BackHeader title="오피스텔 상세" />

        <div v-if="!subscription" class="flex items-center justify-center h-64">
            <p class="text-gray-500">불러오는 중...</p>
        </div>
        <div v-else>
            <!-- 기본 정보 -->
            <section class="bg-white px-4 pt-4 pb-6">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-xl font-bold">{{ subscription.house_nm }}</h1>
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
                    {{ subscription.house_dtl_secd_nm }} · {{ subscription.householdCount }}세대
                </p>
                <p class="text-sm text-gray-500">
                    {{ areaList }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                    <MapPin class="inline mr-1" :size="16" /> {{ subscription.address }}
                </p>

                <p class="flex items-center mt-1 text-sm text-gray-500">
                    <Heart class="inline mr-1" :size="16" stroke-width="1.5" />
                    {{
                        isFavorite
                            ? subscription.favorite_count === 0
                                ? subscription.favorite_count + 1
                                : subscription.favorite_count
                            : subscription.favorite_count - 1 <= 0
                              ? 0
                              : subscription.favorite_count - 1
                    }}
                    / <Eye class="inline ml-1 mr-1" :size="16" stroke-width="1.5" />{{
                        subscription.view_count
                    }}
                </p>

                <p class="mt-2 text-lg font-bold text-blue-600">
                    {{ formatToEok(subscription.price) }}
                </p>
                <div ref="mapRef" class="rounded-lg mt-4 w-full aspect-video"></div>
            </section>

            <!-- 청약 일정 -->
            <section class="px-4 mt-4">
                <h2 class="text-base font-semibold mb-2">
                    <Calendar class="inline mr-1" :size="18" /> 청약 일정
                </h2>
                <div class="bg-white rounded-xl border p-4">
                    <div
                        v-for="item in scheduleItems"
                        :key="item.label"
                        class="flex justify-between items-center py-1"
                    >
                        <div>
                            <p class="text-sm font-medium">{{ item.label }}</p>
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

            <!-- 버튼 그룹 -->
            <section class="px-4 mt-6 space-y-3">
                <!-- 청약 신청 버튼 -->
                <button
                    @click="goToApply"
                    class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl py-3 text-base font-semibold shadow hover:brightness-110 transition-all"
                >
                    <Building2 class="w-5 h-5" /> 청약 신청하기
                </button>
                <p class="text-xs text-gray-400 text-center">* 청약Home 사이트로 이동합니다.</p>

                <!-- 분양 정보 보기 버튼 -->
                <button
                    @click="viewSubscriptionInfo"
                    class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl py-3 text-base font-semibold shadow hover:brightness-110 transition-all"
                >
                    <FileText class="w-5 h-5" /> 분양 정보 보기
                </button>
                <p class="text-xs text-gray-400 text-center">* 분양 정보 페이지로 이동합니다.</p>
            </section>

            <!-- 주변 시설 -->
            <section class="px-4 mt-6">
                <div v-for="group in facilityGroups" :key="group.title" class="mb-6">
                    <h3 class="text-sm font-semibold flex gap-1">
                        <component :is="group.icon" :size="16" :class="group.color" />
                        <span>{{ group.title }}</span>
                    </h3>
                    <div class="space-y-2">
                        <div
                            v-for="item in group.items"
                            :key="item.name"
                            class="bg-white rounded-lg border p-3 flex gap-3"
                        >
                            <component :is="group.icon" :size="18" :class="group.color" />
                            <div>
                                <p class="text-sm font-medium">{{ item.name }}</p>
                                <p class="text-xs text-gray-500">{{ item.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import BackHeader from '@/components/common/BackHeader.vue'
import {
    MapPin,
    Calendar,
    TrainFront,
    GraduationCap,
    Stethoscope,
    ShoppingBag,
} from 'lucide-vue-next'
import { loadKakaoMapScript } from '@/utils/KakaoMapLoader'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const subscription = ref(null)
const mapRef = ref(null)
const favoritesStore = useFavoritesStore()

async function initMap(address) {
    const kakao = await loadKakaoMapScript()
    await nextTick()
    kakao.maps.load(() => {
        if (!mapRef.value) return
        const geocoder = new kakao.maps.services.Geocoder()
        const map = new kakao.maps.Map(mapRef.value, {
            center: new kakao.maps.LatLng(36.5, 127.5),
            level: 5,
        })
        geocoder.addressSearch(address, (res, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(res[0].y, res[0].x)
                map.setCenter(coords)
                new kakao.maps.Marker({ map, position: coords })
            }
        })
    })
}

onMounted(async () => {
    const id = route.params.id
    const res = await api.get('/subscriptions/officetels/detail', { params: { pblanc_no: id } })
    const d = res.data

    subscription.value = {
        ...d,
        type: d.house_secd_nm,
        house_dtl_secd_nm: d.house_dtl_secd_nm,
        address: d.hssply_adres,
        price: d.officetel_type?.[0]?.SUPLY_AMOUNT || '',
        householdCount: d.tot_suply_hshldco,
        view_count: d.view_count,
        pblanc_url: d.pblanc_url,
    }

    await initMap(subscription.value.address)
})

const isFavorite = computed(() => {
    if (!subscription.value) return false
    return favoritesStore.isFavorite(
        subscription.value.house_dtl_secd_nm,
        subscription.value.pblanc_no,
    )
})

const handleFavoriteClick = () => {
    const { house_dtl_secd_nm, pblanc_no } = subscription.value

    if (favoritesStore.isFavorite(house_dtl_secd_nm, pblanc_no)) {
        favoritesStore.removeFavorite({ house_type: house_dtl_secd_nm, pblanc_no })
    } else {
        favoritesStore.addFavorite({ house_type: house_dtl_secd_nm, pblanc_no })
    }
}

// 면적 최소 ~ 최대로 보여주는 함수
const areaList = computed(() => {
    const types = subscription.value?.apt_type || subscription.value?.officetel_type
    if (!types || types.length === 0) return ''

    // 면적만 추출
    const areas = types.map((t) => parseFloat(t.SUPLY_AR || t.EXCLUSE_AR)).filter((a) => !isNaN(a))
    if (areas.length === 0) return ''

    const min = Math.min(...areas)
    const max = Math.max(...areas)

    // 최소 = 최대라면 하나만, 아니면 범위 표기
    return min === max ? `${min.toFixed(1)}㎡` : `${min.toFixed(1)}㎡ ~ ${max.toFixed(1)}㎡`
})

// const areaList = computed(() => {
//     const types = subscription.value?.apt_type || subscription.value?.officetel_type
//     if (!types || types.length === 0) return ''

//     return types
//         .map((t) => {
//             // 아파트는 SUPLY_AR, 오피스텔은 EXCLUSE_AR 사용
//             const area = parseFloat(t.SUPLY_AR || t.EXCLUSE_AR)
//             return isNaN(area) ? null : `${area.toFixed(1)}㎡`
//         })
//         .filter(Boolean) // null 제거
//         .join(' / ')
// })

function formatToEok(price) {
    if (!price) return ''
    const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price
    return isNaN(num) ? '' : `${(num / 10000).toFixed(1)}억`
}

function calcBadge(start, end) {
    if (!start || !end) return ''

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const s = new Date(start.replace(/\./g, '-'))
    const e = new Date(end.replace(/\./g, '-'))
    s.setHours(0, 0, 0, 0)
    e.setHours(0, 0, 0, 0)

    if (today > e) return '마감'
    if (today < s) {
        const diff = Math.ceil((s - today) / (1000 * 60 * 60 * 24))
        return `D-${diff}`
    }
    if (today.getTime() === e.getTime()) return '오늘 마감'
    return '진행중'
}

// 날짜 포맷 함수
function formatDate(dateString) {
    if (!dateString) return ''
    const parts = dateString.split('-')
    return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}` : dateString
}

const scheduleItems = computed(() => {
    const d = subscription.value

    // 변환할 날짜 필드 목록
    const dateFields = [
        'rcrit_pblanc_de',
        'rcept_bgnde',
        'rcept_endde',
        'przwner_presnatn_de',
        'cntrct_cncls_bgnde',
        'cntrct_cncls_endde',
    ]

    // 날짜 필드 포맷팅
    dateFields.forEach((key) => {
        if (d[key]) d[key] = formatDate(d[key])
    })

    // 헬퍼 함수: 날짜 문자열 두 개가 null이면 안내 문구 반환
    function makeDateText(start, end) {
        if (!start && !end) return '일정이 정해지지 않았습니다!'
        return `${start || '-'} ~ ${end || '-'}`
    }

    return [
        {
            label: '청약 접수',
            date: makeDateText(d.rcept_bgnde, d.rcept_endde),
            badge: calcBadge(d.rcept_bgnde, d.rcept_endde),
        },
        {
            label: '당첨자 발표',
            date: makeDateText(d.przwner_presnatn_de, d.przwner_presnatn_de),
            badge: calcBadge(d.przwner_presnatn_de, d.przwner_presnatn_de),
        },
        {
            label: '계약',
            date: makeDateText(d.cntrct_cncls_bgnde, d.cntrct_cncls_endde),
            badge: calcBadge(d.cntrct_cncls_bgnde, d.cntrct_cncls_endde),
        },
    ]
})

function badgeColor(label) {
    if (label === '마감') return 'bg-gray-100 text-gray-500'
    if (label === '진행중') return 'bg-red-100 text-red-700'
    if (label.startsWith('D-')) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
}

const iconMap = {
    subway: { title: '교통', icon: TrainFront, color: 'text-green-600' },
    school: { title: '교육 시설', icon: GraduationCap, color: 'text-purple-600' },
    hospital: { title: '의료 시설', icon: Stethoscope, color: 'text-red-500' },
    mart: { title: '편의 시설', icon: ShoppingBag, color: 'text-orange-500' },
}

const facilityGroups = computed(() => {
    if (!subscription.value?.infra_places) return []
    const grouped = {}
    subscription.value.infra_places.forEach((place) => {
        const meta = iconMap[place.place_type]
        if (!meta) return
        if (!grouped[meta.title]) grouped[meta.title] = { ...meta, items: [] }
        grouped[meta.title].items.push({
            name: place.place_name,
            desc: `${(place.distance / 1000).toFixed(1)}km · 도보 ${walkingTimeFromKm(place.distance / 1000)}분`,
        })
    })
    return Object.values(grouped)
})

function goToApply() {
    window.open(
        'https://www.applyhome.co.kr/ap/apb/reqst/selectSubscrtReqstUOMainView.do',
        '_blank',
    )
}

function viewSubscriptionInfo() {
    if (!subscription.value?.pblanc_url) return
    window.open(subscription.value.pblanc_url, '_blank')
}

// 도보 시간 계산 함수
function walkingTimeFromKm(km) {
    if (typeof km !== 'number' || isNaN(km) || km < 0) {
        throw new Error('유효한 양의 숫자(km)를 입력해주세요.')
    }

    const minutesPerKm = 12
    return Math.round(km * minutesPerKm)
}
</script>
