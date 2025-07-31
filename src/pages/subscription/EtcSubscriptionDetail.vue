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
                </div>
                <p class="text-sm text-gray-500">
                    {{ subscription.type }} · {{ areaList }} · {{ subscription.householdCount }}세대
                </p>
                <p class="mt-1 text-sm text-gray-500">
                    <MapPin class="inline mr-1" :size="16" /> {{ subscription.address }}
                </p>

                <p class="flex items-center mt-1 text-sm text-gray-500">
                    <Heart class="inline mr-1" :size="16" stroke-width="1.5" />{{
                        subscription.favoriteCount
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
                        class="flex justify-between py-1"
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

const route = useRoute()
const subscription = ref(null)
const mapRef = ref(null)

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
        address: d.hssply_adres,
        price: d.officetel_type?.[0]?.SUPLY_AMOUNT || '',
        householdCount: d.tot_suply_hshldco,
        view_count: d.view_count,
        pblanc_url: d.pblanc_url,
    }
    await initMap(subscription.value.address)
})

const areaList = computed(() => {
    if (!subscription.value?.officetel_type) return ''
    return subscription.value.officetel_type
        .map((t) => `${parseFloat(t.EXCLUSE_AR).toFixed(1)}㎡`)
        .join(' / ')
})

function formatToEok(price) {
    if (!price) return ''
    const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price
    return isNaN(num) ? '' : `${(num / 10000).toFixed(1)}억`
}

function calcBadge(start, end) {
    if (!start || !end) return ''
    const today = new Date()
    const s = new Date(start.replace(/\./g, '-'))
    const e = new Date(end.replace(/\./g, '-'))
    if (today > e) return '마감'
    if (today < s) return `D-${Math.ceil((e - today) / (1000 * 60 * 60 * 24))}`
    return '진행중'
}

const scheduleItems = computed(() => {
    const d = subscription.value
    if (!d) return []
    const text = (s, e) => (!s && !e ? '일정이 정해지지 않았습니다!' : `${s || '-'} ~ ${e || '-'}`)
    return [
        {
            label: '청약 접수',
            date: text(d.rcept_bgnde, d.rcept_endde),
            badge: calcBadge(d.rcept_bgnde, d.rcept_endde),
        },
        { label: '당첨자 발표', date: text(d.przwner_presnatn_de, d.przwner_presnatn_de) },
        { label: '계약', date: text(d.cntrct_cncls_bgnde, d.cntrct_cncls_endde) },
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
            desc: `${(place.distance / 1000).toFixed(1)}km · ${place.road_address_name}`,
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
</script>
