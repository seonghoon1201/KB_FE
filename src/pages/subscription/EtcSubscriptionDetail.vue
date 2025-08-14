<!-- src/pages/subscription/EtcSubscriptionDetail.vue (예시 경로) -->
<!-- 오피스텔 상세 페이지 -->
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
                <!-- 수평선 -->
                <div class="border-b border-gray-200 mb-3"></div>

                <p class="text-sm text-gray-500">
                    <House class="inline mr-1" :size="16" /> {{ subscription.house_dtl_secd_nm }} ·
                    {{ subscription.householdCount }}세대
                </p>
                <p class="text-sm text-gray-500">
                    <Expand class="inline mr-1" :size="14" /> {{ areaList }}
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

                <!-- 지도 래퍼를 relative로 감싸기 -->
                <div class="relative mt-4">
                    <!-- 지도 영역: 아파트 상세와 동일한 높이 -->
                    <div
                        ref="mapRef"
                        class="rounded-lg mt-4 w-full h-[35vh] min-h-72 md:h-[30vh]"
                    />
                    <!-- 좌측 상단 필터 바 -->
                    <div class="absolute top-2 left-2 z-10">
                        <div
                            class="bg-white/90 backdrop-blur rounded-xl shadow border border-gray-200 p-1 flex gap-1"
                        >
                            <button
                                v-for="btn in filterButtons"
                                :key="btn.key"
                                @click="handleFilterClick(btn.key)"
                                :class="[
                                    'px-2.5 py-1 rounded-lg text-xs font-medium border transition',
                                    infraFilter === btn.key
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200',
                                ]"
                            >
                                {{ btn.label }}
                            </button>
                        </div>
                    </div>
                </div>
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

            <!-- 나의 당첨 가능성 -->
            <section class="px-4 mt-6">
                <PossibilitySection
                    :pblanc-no="String(subscription.pblanc_no || route.params.id)"
                    :title="subscription.house_nm"
                    :house-type="subscription.type"
                />
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
    </div>

    <!-- 화면 오른쪽 하단 챗봇 플로팅 -->
    <div class="fixed bottom-[16px] right-4 z-50">
        <div class="bg-[#00AEFF] rounded-full p-3 shadow-lg">
            <BotMessageSquare class="text-white" @click="goToChatbot" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import BackHeader from '@/components/common/BackHeader.vue'
import {
    MapPin,
    Calendar,
    TrainFront,
    GraduationCap,
    Baby,
    Stethoscope,
    ShoppingBag,
    Expand,
    House,
    Heart,
    Eye,
    FileText,
    Building2,
} from 'lucide-vue-next'
import PossibilitySection from '@/components/SubDetail/PossibilitySection.vue'
import { loadKakaoMapScript } from '@/utils/KakaoMapLoader'
import { useFavoritesStore } from '@/stores/favorites'
import { BotMessageSquare } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const subscription = ref(null)
const mapRef = ref(null)
const favoritesStore = useFavoritesStore()
const loading = ref(true)

// 지도 상태
const mapInstance = ref(null)
const activeOverlay = ref(null)
const baseMarker = ref(null)
const infraMarkers = ref([])
const openMarker = ref(null)
let lastMarkerClickAt = 0
const sharedInfoWindow = ref(null)
const didFirstRender = ref(false)

// ====== 필터: 아파트 상세와 동일한 토글 방식 ======
const infraFilter = ref('none')
const filterKeyToTypes = {
    none: [],
    all: null,
    '의료 시설': ['hospital'],
    교통: ['subway', 'bus'],
    '편의 시설': ['mart'],
    학교: ['school'],
    '유치원 · 어린이집': ['kindergarten'],
}
const filterButtons = [
    { key: 'all', label: '전체' },
    { key: '의료 시설', label: '의료' },
    { key: '교통', label: '교통' },
    { key: '편의 시설', label: '편의' },
    { key: '학교', label: '학교' },
    { key: '유치원 · 어린이집', label: '유치원' },
]
function handleFilterClick(key) {
    infraFilter.value = infraFilter.value === key ? 'none' : key
}

// ====== 커스텀 핀 마커 (아파트 상세 동일) ======
const ICON_BY_TYPE = {
    subway: { color: '#22c55e' },
    bus: { color: '#22c55e' },
    school: { color: '#7c3aed' },
    kindergarten: { color: '#7c3aed' },
    hospital: { color: '#ef4444' },
    mart: { color: '#f59e0b' },
}

function makePinSvgDataUrl(color, { size = 34 } = {}) {
    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="${size}" height="${size}">
    <defs>
      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
        <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
        <feMerge>
          <feMergeNode in="offsetBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path d="M16 0c-6.6 0-12 5.4-12 12 0 9 12 22 12 22s12-13 12-22C28 5.4 22.6 0 16 0z"
          fill="${color}" stroke="white" stroke-width="2" filter="url(#dropShadow)"/>
    <circle cx="16" cy="12" r="4.5" fill="white"/>
  </svg>`
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

function makePinImage(color, { size = 34 } = {}) {
    const kakao = window.kakao
    const url = makePinSvgDataUrl(color, { size })
    return new kakao.maps.MarkerImage(url, new kakao.maps.Size(size, size), {
        offset: new kakao.maps.Point(size / 2, size - 3),
    })
}

function closeInfo() {
    if (sharedInfoWindow.value) sharedInfoWindow.value.close()
    if (openMarker.value) {
        const m = openMarker.value
        m.setImage(
            m._images?.normal ??
                makePinImage(ICON_BY_TYPE[m.place_type]?.color || '#3b82f6', { size: 34 }),
        )
        m.setZIndex(150)
    }
    openMarker.value = null
}

function closeOverlay() {
    if (activeOverlay.value) {
        activeOverlay.value.setMap(null)
        activeOverlay.value = null
    }
}

async function initMap(lat, lng) {
    const kakao = await loadKakaoMapScript()
    await nextTick()

    kakao.maps.load(() => {
        if (!mapRef.value) return

        const map = new kakao.maps.Map(mapRef.value, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 5,
        })
        mapInstance.value = map

        baseMarker.value = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(lat, lng),
            zIndex: 200,
        })

        sharedInfoWindow.value = new kakao.maps.InfoWindow({ removable: false, zIndex: 1000 })

        kakao.maps.event.addListener(map, 'click', () => {
            if (Date.now() - lastMarkerClickAt < 150) return
            closeInfo()
            openMarker.value = null
        })

        // 첫 그리기
        drawInfraMarkers()
    })
}

function clearInfraMarkers() {
    closeOverlay()
    infraMarkers.value.forEach((m) => m.setMap(null))
    infraMarkers.value = []
}

function drawInfraMarkers() {
    const kakao = window.kakao
    if (!mapInstance.value || !subscription.value?.infra_places) return

    // 현재 뷰 저장 (필터 변경 시 복원)
    const map = mapInstance.value
    const prevCenter = map.getCenter()
    const prevLevel = map.getLevel()

    clearInfraMarkers()
    const bounds = new kakao.maps.LatLngBounds()
    if (baseMarker.value) bounds.extend(baseMarker.value.getPosition())

    // 모두 해제 상태면 뷰만 유지
    if (infraFilter.value === 'none') {
        if (!didFirstRender.value) {
            if (baseMarker.value) map.setCenter(baseMarker.value.getPosition())
            didFirstRender.value = true
        } else {
            map.setCenter(prevCenter)
            map.setLevel(prevLevel)
        }
        return
    }

    subscription.value.infra_places.forEach((place) => {
        const lat = Number(place.latitude)
        const lng = Number(place.longitude)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

        // 카테고리 필터
        const types = filterKeyToTypes[infraFilter.value]
        if (types && !types.includes(place.place_type)) return

        const pos = new kakao.maps.LatLng(lat, lng)

        // 커스텀 핀 이미지 (노말/호버/액티브)
        const meta = ICON_BY_TYPE[place.place_type] || { color: '#3b82f6' }
        const normalImage = makePinImage(meta.color, { size: 34 })
        const hoverImage = makePinImage(meta.color, { size: 40 })
        const activeImage = makePinImage(meta.color, { size: 42 })

        const marker = new kakao.maps.Marker({
            position: pos,
            map: mapInstance.value,
            image: normalImage,
            title: place.place_name,
            zIndex: 150,
        })
        marker._images = { normal: normalImage, hover: hoverImage, active: activeImage }
        marker.place_type = place.place_type

        // InfoWindow
        const km = Number(place.distance) / 1000
        const kmText = Number.isFinite(km) ? km.toFixed(1) : '-'
        const walk = walkingTimeFromKm(km)
        const html = `
      <div style="padding:8px 10px; max-width:220px;">
        <div style="font-weight:700; font-size:13px; color:#111827; margin-bottom:2px;">
          ${place.place_name}
        </div>
        <div style="font-size:12px; color:#6b7280;">
          ${kmText}km · 도보 ${walk ?? '-'}분
        </div>
      </div>`

        kakao.maps.event.addListener(marker, 'click', () => {
            lastMarkerClickAt = Date.now()
            if (openMarker.value === marker) {
                closeInfo()
                marker.setImage(marker._images.normal)
                marker.setZIndex(150)
                return
            }
            closeInfo()
            sharedInfoWindow.value.setContent(html)
            sharedInfoWindow.value.open(mapInstance.value, marker)
            openMarker.value = marker
            marker.setImage(marker._images.active)
            marker.setZIndex(300)
        })

        infraMarkers.value.push(marker)
        // bounds.extend(pos) // 필요시 활성화
    })

    // 뷰 유지/고정 규칙
    if (!didFirstRender.value) {
        if (baseMarker.value) {
            map.setCenter(baseMarker.value.getPosition())
            // map.setLevel(5)
        }
        didFirstRender.value = true
    } else {
        map.setCenter(prevCenter)
        map.setLevel(prevLevel)
    }
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
        favorite_count: d.favorite_count,
        view_count: d.view_count,
        pblanc_url: d.pblanc_url,
        lat: d.latitude,
        long: d.longitude,
    }

    await nextTick()
    await initMap(Number(subscription.value.lat), Number(subscription.value.long))

    // 아파트 상세와 동일하게: 의존성 변화 시 마커 다시 그림
    watch(
        [() => mapInstance.value, () => subscription.value?.infra_places, () => infraFilter.value],
        ([map, places]) => {
            if (map && places) drawInfraMarkers()
        },
        { immediate: true },
    )
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
    const areas = types.map((t) => parseFloat(t.SUPLY_AR || t.EXCLUSE_AR)).filter((a) => !isNaN(a))
    if (areas.length === 0) return ''
    const min = Math.min(...areas)
    const max = Math.max(...areas)
    return min === max ? `${min.toFixed(1)}㎡` : `${min.toFixed(1)}㎡ ~ ${max.toFixed(1)}㎡`
})

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
    const dateFields = [
        'rcrit_pblanc_de',
        'rcept_bgnde',
        'rcept_endde',
        'przwner_presnatn_de',
        'cntrct_cncls_bgnde',
        'cntrct_cncls_endde',
    ]
    dateFields.forEach((key) => {
        if (d[key]) d[key] = formatDate(d[key])
    })

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
    if (label === '진행중' || label === '오늘 마감') return 'bg-red-100 text-red-700'
    if (label.startsWith('D-')) {
        const num = parseInt(label.split('-')[1])
        if (num > 7) return 'bg-blue-100 text-blue-700'
        if (num > 3) return 'bg-yellow-100 text-yellow-700'
        return 'bg-red-100 text-red-700'
    }
    return 'bg-gray-100 text-gray-700'
}

const preferredOrder = ['의료 시설', '교통', '편의 시설', '학교', '유치원 · 어린이집']

const iconMap = {
    subway: { title: '교통', icon: TrainFront, color: 'text-green-600' },
    bus: { title: '교통', icon: TrainFront, color: 'text-green-600' },
    school: { title: '학교', icon: GraduationCap, color: 'text-purple-600' },
    kindergarten: { title: '유치원 · 어린이집', icon: Baby, color: 'text-purple-600' },
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
    return Object.values(grouped).sort(
        (a, b) => preferredOrder.indexOf(a.title) - preferredOrder.indexOf(b.title),
    )
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
    const v = Number(km)
    if (!Number.isFinite(v) || v < 0) return null
    const minutesPerKm = 12
    return Math.max(1, Math.round(v * minutesPerKm))
}

const goToChatbot = () => {
    router.push('/chatbot')
}
</script>
