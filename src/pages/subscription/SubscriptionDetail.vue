<template>
    <div class="bg-gray-50 min-h-screen pt-12">
        <!-- 상단 헤더 -->
        <BackHeader title="청약 상세" />

        <!-- 로딩 중일 때 -->
        <div v-if="!subscription" class="flex items-center justify-center h-64">
            <p class="text-gray-500">불러오는 중...</p>
        </div>
        <div v-else >
            <!-- 공고 기본 정보 -->
            <section class="bg-white px-4 pt-4 pb-6">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-xl font-bold text-gray-900">{{ subscription.house_nm }}</h1>
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
                <p class="text-sm text-gray-500">아파트 · {{ subscription.householdCount }}세대</p>
                <p class="text-sm text-gray-500">{{ areaList }}</p>
                <p class="mt-1 text-sm text-gray-500">
                    <MapPin class="inline mr-1" :size="16" />{{ subscription.address }}
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
                    {{ formatToEok(subscription.min_price) }} ~
                    {{ formatToEok(subscription.max_price) }}
                </p>

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
</template>

<script setup>
import {
    Heart,
    Eye,
    MapPin,
    Calendar,
    TrainFront,
    GraduationCap,
    Stethoscope,
    ShoppingBag,
    FileText,
    Building2,
} from 'lucide-vue-next'
import { onMounted, ref, computed, nextTick, watchEffect } from 'vue'
import api from '@/api/axios'
import { useRoute } from 'vue-router'
import BackHeader from '@/components/common/BackHeader.vue'
import PossibilitySection from '@/components/SubDetail/PossibilitySection.vue'
import RankSection from '@/components/SubDetail/RankSection.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { loadKakaoMapScript } from '@/utils/KakaoMapLoader'

const route = useRoute()
const favoritesStore = useFavoritesStore()
const subscription = ref(null)
const loading = ref(true)
const mapRef = ref(null)

// // 지도 초기화 함수
// async function initMap(address) {
//     const kakao = await loadKakaoMapScript()
//     await nextTick()

//     kakao.maps.load(() => {
//         if (!mapRef.value) return

//         const geocoder = new kakao.maps.services.Geocoder()
//         const cleanAddress = normalizeAddress(address)
//         console.log('주소 검색 시작:', cleanAddress)

//         const map = new kakao.maps.Map(mapRef.value, {
//             center: new kakao.maps.LatLng(36.5, 127.5),
//             level: 5,
//         })

//         geocoder.addressSearch(cleanAddress, function (result, status) {
//             if (status === kakao.maps.services.Status.OK) {
//                 const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
//                 map.setCenter(coords)
//                 new kakao.maps.Marker({ map, position: coords })
//             } else {
//                 console.warn('주소를 좌표로 변환할 수 없습니다:', status, cleanAddress)

//                 // 1차 검색 실패 → 'OO리'까지만 사용해 재검색
//                 const partialAddr = getAddressUpToRi(subscription.value.address)
//                 console.log('Fallback 주소 재검색:', partialAddr)

//                 geocoder.addressSearch(partialAddr, function (res2, status2) {
//                     if (status2 === kakao.maps.services.Status.OK) {
//                         const coords = new kakao.maps.LatLng(res2[0].y, res2[0].x)
//                         map.setCenter(coords)
//                         new kakao.maps.Marker({ map, position: coords })
//                     } else {
//                         console.warn('Fallback 주소도 좌표로 변환 실패:', status2, partialAddr)

//                         // 완전 실패 → 기본 좌표 사용
//                         const fallbackCoords = new kakao.maps.LatLng(36.5, 127.5)
//                         map.setCenter(fallbackCoords)
//                         new kakao.maps.Marker({ map, position: fallbackCoords })
//                     }
//                 })
//             }
//         })
//     })
// }

// 지도 초기화 함수
async function initMap(lat, lng) {
    const kakao = await loadKakaoMapScript()
    await nextTick()

    kakao.maps.load(() => {
        if (!mapRef.value) return

        const map = new kakao.maps.Map(mapRef.value, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 5,
        })

        new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(lat, lng),
        })
    })
}

onMounted(async () => {
    const pblancNo = route.params.id

    try {
        const res = await api.get('/subscriptions/apartments/detail', {
            params: { pblanc_no: pblancNo },
        })

        const d = res.data

        // 변환할 날짜 필드 목록
        const dateFields = [
            'rcrit_pblanc_de',
            'rcept_bgnde',
            'rcept_endde',
            'spsply_rcept_bgnde',
            'spsply_rcept_endde',
            'gnrl_rnk1_crsparea_rcptde',
            'gnrl_rnk1_crsparea_endde',
            'gnrl_rnk1_etc_area_rcptde',
            'gnrl_rnk1_etc_area_endde',
            'gnrl_rnk2_crsparea_rcptde',
            'gnrl_rnk2_crsparea_endde',
            'gnrl_rnk2_etc_area_rcptde',
            'gnrl_rnk2_etc_area_endde',
            'przwner_presnatn_de',
            'cntrct_cncls_bgnde',
            'cntrct_cncls_endde',
        ]

        // 날짜 필드 포맷팅
        dateFields.forEach((key) => {
            if (d[key]) d[key] = formatDate(d[key])
        })

        // ---- 가격 범위 계산 ----

        let minPrice = null
        let maxPrice = null

        if (Array.isArray(d.apt_type)) {
            const prices = d.apt_type
                .map((t) => Number(t.LTTOT_TOP_AMOUNT))
                .filter((v) => !isNaN(v))

            if (prices.length > 0) {
                minPrice = Math.min(...prices)
                maxPrice = Math.max(...prices)

                // 혹시라도 데이터 이상으로 뒤바뀌었으면 방어적으로 교환
                if (minPrice > maxPrice) {
                    const tmp = minPrice
                    minPrice = maxPrice
                    maxPrice = tmp
                }
            }
        }

        // subscription 객체 구성
        subscription.value = {
            ...d,
            house_nm: d.house_nm,
            type: d.house_secd_nm,
            address: d.hssply_adres,
            min_price: minPrice,
            max_price: maxPrice,
            householdCount: d.tot_suply_hshldco,
            favorite_count: d.favorite_count,
            view_count: d.view_count,
            pblanc_url: d.pblanc_url,
            lat: d.latitude,
            long: d.longitude,
        }
        await nextTick() // DOM 업데이트 기다림
        await initMap(Number(subscription.value.lat), Number(subscription.value.long))
        new kakao.maps.services.Geocoder().addressSearch(
            '서울특별시 동대문구 제기동 892-68',
            // console.log,
            function () {}, // 아무것도 안 함
        )
    } catch (err) {
        console.error('상세 정보 로드 실패', err)
    } finally {
        loading.value = false
    }

    // // --- watchEffect로 map init ---
    // watchEffect(async () => {
    //     if (subscription.value?.address && mapRef.value) {
    //         await initMap(subscription.value.address)
    //     }
    // })
})

// 날짜 포맷 함수
function formatDate(dateString) {
    if (!dateString) return ''
    const parts = dateString.split('-')
    return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}` : dateString
}

const isFavorite = computed(() => {
    if (!subscription.value) return false
    return favoritesStore.isFavorite(subscription.value.house_secd_nm, subscription.value.pblanc_no)
})

const handleFavoriteClick = () => {
    const { house_secd_nm, pblanc_no } = subscription.value

    if (favoritesStore.isFavorite(house_secd_nm, pblanc_no)) {
        favoritesStore.removeFavorite({ house_type: house_secd_nm, pblanc_no })
    } else {
        favoritesStore.addFavorite({ house_type: house_secd_nm, pblanc_no })
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

// 모든 면적 보여주는 함수
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

const scheduleItems = computed(() => {
    if (!subscription.value) return []

    const d = subscription.value

    // 헬퍼 함수: 날짜 문자열 두 개가 null이면 안내 문구 반환
    function makeDateText(start, end) {
        if (!start && !end) return '일정이 정해지지 않았습니다!'
        return `${start || '-'} ~ ${end || '-'}`
    }

    return [
        {
            label: '특별공급',
            date: makeDateText(d.spsply_rcept_bgnde, d.spsply_rcept_endde),
            badge: calcBadge(d.spsply_rcept_bgnde, d.spsply_rcept_endde),
        },
        {
            label: '1순위 해당 지역',
            date: makeDateText(d.gnrl_rnk1_crsparea_rcptde, d.gnrl_rnk1_crsparea_endde),
            badge: calcBadge(d.gnrl_rnk1_crsparea_rcptde, d.gnrl_rnk1_crsparea_endde),
        },
        {
            label: '1순위 기타 지역',
            date: makeDateText(d.gnrl_rnk1_etc_area_rcptde, d.gnrl_rnk1_etc_area_endde),
            badge: calcBadge(d.gnrl_rnk1_etc_area_rcptde, d.gnrl_rnk1_etc_area_endde),
        },
        {
            label: '2순위 해당 지역',
            date: makeDateText(d.gnrl_rnk2_crsparea_rcptde, d.gnrl_rnk2_crsparea_endde),
            badge: calcBadge(d.gnrl_rnk2_crsparea_rcptde, d.gnrl_rnk2_crsparea_endde),
        },
        {
            label: '2순위 기타 지역',
            date: makeDateText(d.gnrl_rnk2_etc_area_rcptde, d.gnrl_rnk2_etc_area_endde),
            badge: calcBadge(d.gnrl_rnk2_etc_area_rcptde, d.gnrl_rnk2_etc_area_endde),
        },
    ]
})

function badgeColor(label) {
    // 마감
    if (label === '마감') {
        return 'bg-gray-100 text-gray-500'
    }

    // 진행중
    if (label === '진행중' || label === '오늘 마감') {
        return 'bg-red-100 text-red-700'
    }

    // D-N (N 숫자만 추출)
    if (label.startsWith('D-')) {
        const num = parseInt(label.split('-')[1])
        if (num > 7) return 'bg-blue-100 text-blue-700'
        if (num > 3) return 'bg-yellow-100 text-yellow-700'
        return 'bg-red-100 text-red-700'
    }

    return 'bg-gray-100 text-gray-700'
}

const iconMap = {
    subway: { title: '교통', icon: TrainFront, color: 'text-green-600' },
    bus: { title: '교통', icon: TrainFront, color: 'text-green-600' },
    school: { title: '교육 시설', icon: GraduationCap, color: 'text-purple-600' },
    hospital: { title: '의료 시설', icon: Stethoscope, color: 'text-red-500' },
    mart: { title: '편의 시설', icon: ShoppingBag, color: 'text-orange-500' },
}

const facilityGroups = computed(() => {
    if (!subscription.value?.infra_places) return []

    // 1. 타입별로 묶기
    const grouped = {}
    subscription.value.infra_places.forEach((place) => {
        const meta = iconMap[place.place_type]
        if (!meta) return

        if (!grouped[meta.title]) {
            grouped[meta.title] = { ...meta, items: [] }
        }

        grouped[meta.title].items.push({
            name: place.place_name,
            desc: `${(place.distance / 1000).toFixed(1)}km · 도보 ${walkingTimeFromKm(place.distance / 1000)}분`,
        })
    })

    // 2. 객체 → 배열 변환
    return Object.values(grouped)
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

// function normalizeAddress(addr) {
//     if (!addr) return ''
//     return addr
//         .replace(/외\s*\d+필지/, '') // "외 10필지"만 제거
//         .replace(/일원$/, '') // "일원" 글자만 제거
//         .replace(/번지/g, '')
//         .replace(/\s+/g, ' ') // 공백 정리
//         .trim()
// }

// function getAddressUpToRi(addr) {
//     if (!addr) return ''
//     const match = addr.match(/^(.*?리)/) // 처음 '리'까지 매칭
//     if (match) return match[1]
//     return addr
// }

// const openPromotionLink = () => {
//     window.open('https://www.applyhome.co.kr/co/coa/selectMainView.do', '_blank')
// }

function goToApply() {
    window.open(
        'https://www.applyhome.co.kr/ap/aph/reqst/selectSubscrtReqstAptMainView.do',
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
