<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <!-- ✅ 상단 헤더 -->
        <BackHeader title="청약 지도" />

        <!-- ✅ 상단 탭 -->
        <div
            class="px-4 py-3 bg-white border-b border-gray-100 z-20 flex justify-between items-center"
        >
            <!-- 왼쪽 공간 (비워둠) -->
            <div class="flex-1"></div>
            <!-- 가운데 공간 -->
            <div class="flex-initial inline-flex gap-2">
                <button
                    class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                    :class="
                        activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                    "
                    @click="activeTab = 'all'"
                >
                    전체 청약 지도
                </button>
                <button
                    class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                    :class="
                        activeTab === 'favorite'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                    "
                    @click="activeTab = 'favorite'"
                >
                    찜한 청약 지도
                </button>
            </div>

            <!-- 오른쪽 끝 필터 버튼 -->
            <div class="flex-1 flex justify-end ml-1">
                <button
                    class="z-10 px-3 py-2 rounded-full text-sm text-black-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    @click="isFilterOpen = true"
                >
                    <ListFilter class="w-4 h-4" />
                </button>
            </div>
        </div>
        <div
            v-if="isFilterOpen"
            class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end justify-center"
            @click.self="close"
        >
            <div class="w-full bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">지역 선택</h2>

                <!-- 지역 선택 -->
                <label class="text-sm font-semibold text-gray-800 mb-1 block"></label>
                <div class="space-y-2 mb-3">
                    <!-- 시/도 선택 -->
                    <select v-model="selectedCity" class="w-full border rounded px-3 py-2 text-sm">
                        <option disabled value="">시/도를 선택해주세요</option>
                        <option v-for="city in cities" :key="city">{{ city }}</option>
                    </select>

                    <!-- 군/구 선택 -->
                    <select
                        v-model="selectedDistrict"
                        class="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option disabled value="">군/구를 선택해주세요</option>
                        <option v-for="gu in filteredDistricts" :key="gu">{{ gu }}</option>
                    </select>

                    <p
                        v-if="filterError"
                        class="flex items-center mt-1 text-xs text-red-600 font-medium leading-relaxed"
                    >
                        <CircleAlert size="12" class="mr-1" /> 군/구를 선택해 주세요
                    </p>
                </div>

                <button
                    @click="applyFilters"
                    class="w-full bg-blue-500 text-white font-semibold py-3 rounded text-sm hover:bg-blue-600"
                >
                    필터 적용
                </button>
            </div>
        </div>

        <!-- ✅ 지도 -->
        <div ref="mapRef" class="w-full" :style="mapHeightStyle" />

        <!-- ✅ 청약 상세 카드 -->
        <div v-if="selectedItem" class="absolute left-4 right-4 bottom-24 z-20">
            <SubscriptionCard
                :subscription="selectedItem"
                :key="selectedItem.pblanc_no"
                @favorite-changed="onFavoriteChange"
            />
        </div>

        <!-- ✅ 하단 내비게이션 -->
        <BottomNavbar />
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { loadKakaoMapScript } from '@/utils/KakaoMapLoader'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import { districts } from '@/data/districts'
import { ListFilter, CircleAlert } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import api from '@/api/axios'

// ✅ 프롭 정의 (테스트 시 마감 공고 표시하려면 :showExpired="true")
const props = defineProps({
    showExpired: { type: Boolean, default: false },
})

const subscriptionList = ref([]) // 전체 공고 리스트
const coordsCache = {} // 주소 → {lat, lng}
const userStore = useUserStore()

const mapRef = ref(null)
const map = ref(null)
const markers = ref([])
const selectedItem = ref(null)
const activeTab = ref('all')

// 필터 관련 상태
const isFilterOpen = ref(false)
const filterError = ref(false)
const selectedCity = ref('')
const selectedDistrict = ref('')
const cities = Object.keys(districts)
const filteredDistricts = computed(() => districts[selectedCity.value] || [])

// 지도 영역 스타일
const mapHeightStyle = computed(() => ({
    height: `calc(100vh - 56px - 52px - 60px)`,
}))

function onFavoriteChange({ pblanc_no, is_favorite }) {
  const i = subscriptionList.value.findIndex(v => v.pblanc_no === pblanc_no)
  if (i !== -1) subscriptionList.value[i] = { ...subscriptionList.value[i], is_favorite }
  if (selectedItem.value?.pblanc_no === pblanc_no) {
    selectedItem.value = { ...selectedItem.value, is_favorite }
  }
  renderMarkers(visibleList.value, true)
  // (찜 탭이면 bounds 조정 로직 유지)
}

// =============== 날짜/마감 헬퍼 ===============
function parseYMDToEndOfDay(s) {
    if (!s) return null
    const [y, m, d] = s
        .trim()
        .replace(/\./g, '-')
        .split('-')
        .map((n) => parseInt(n, 10))
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d, 23, 59, 59, 999)
}

function isExpired(item, now = new Date()) {
    if (!item?.application_period) return true // 기간 없으면 제외
    const parts = item.application_period.split('~').map((s) => s.trim())
    if (parts.length < 2) return true
    const end = parseYMDToEndOfDay(parts[1])
    if (!end) return true
    return end < now // 마감 당일 23:59:59까지 유효
}

// 현재 탭(전체/찜) + 마감여부를 반영한 최종 리스트
const visibleList = computed(() => {
    let list = subscriptionList.value
    if (!props.showExpired) {
        list = list.filter((item) => !isExpired(item))
    }
    if (activeTab.value === 'favorite') {
        list = list.filter((item) => item.is_favorite)
    }
    return list
})

// =============== 지오코딩 유틸 ===============
async function getCoords(addr) {
    if (coordsCache[addr]) return coordsCache[addr]
    const kakao = window.kakao
    const geocoder = new kakao.maps.services.Geocoder()
    return new Promise((resolve) => {
        geocoder.addressSearch(addr, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const lat = parseFloat(result[0].y)
                const lng = parseFloat(result[0].x)
                coordsCache[addr] = { lat, lng }
                resolve(coordsCache[addr])
            } else {
                resolve(null)
            }
        })
    })
}

// =============== 마커 렌더링 ===============
function renderMarkers(list, skipBoundsCheck = false) {
    const kakao = window.kakao
    if (!map.value) return

    // 기존 마커 제거
    markers.value.forEach((m) => m.setMap(null))
    markers.value = []

    let bounds = null
    if (!skipBoundsCheck) {
        bounds = map.value.getBounds?.()
        if (!bounds || typeof bounds.contains !== 'function') return
    }

    list.forEach((item) => {
        const lat = parseFloat(item.latitude)
        const lng = parseFloat(item.longitude)
        if (isNaN(lat) || isNaN(lng)) return

        const pos = new kakao.maps.LatLng(lat, lng)
        if (!skipBoundsCheck && !bounds.contains(pos)) return

        const marker = new kakao.maps.Marker({ position: pos, map: map.value })
        kakao.maps.event.addListener(marker, 'click', () => {
            const newItem = {
                ...item,
                city: item.city || item.si,
                district: item.district || item.sigungu,
            }
            if (newItem.application_period) {
                const [start, end] = newItem.application_period.split('~').map((s) => s.trim())
                newItem.application_start_date = start
                newItem.application_end_date = end
            }
            selectedItem.value = newItem
        })

        markers.value.push(marker)
    })
}

// =============== 지역 필터 버튼 ===============
const applyFilters = async () => {
    const kakao = await loadKakaoMapScript()
    const geocoder = new kakao.maps.services.Geocoder()
    if (!selectedDistrict.value) {
        filterError.value = true
        return
    }
    const address = `${selectedCity.value} ${selectedDistrict.value}`
    geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
            map.value.setCenter(coords)
            map.value.setLevel(8) // 줌 고정
        }
    })
    filterError.value = false
    isFilterOpen.value = false
}

// =============== 유저 중심 좌표 ===============
async function getUserCenter() {
    if (userStore.coords?.lat && userStore.coords?.lng) {
        return userStore.coords
    }
    const kakao = await loadKakaoMapScript()
    const geocoder = new kakao.maps.services.Geocoder()
    const addr = userStore.fullAddress || userStore.address
    const target = addr && addr.trim().length > 0 ? addr.trim() : '서울특별시청'
    const coords = await new Promise((resolve) => {
        geocoder.addressSearch(target, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) })
            } else {
                resolve({ lat: 37.5665, lng: 126.978 }) // 서울시청 폴백
            }
        })
    })
    userStore.coords = coords
    return coords
}

watch(
    () => userStore.coords,
    (c) => {
        if (c && map.value) {
            map.value.setCenter(new kakao.maps.LatLng(c.lat, c.lng))
            // level은 유지
        }
    },
)

// =============== 초기화 ===============
onMounted(async () => {
    const favoritesStore = useFavoritesStore()

    const [kakao, userCenter, _favorites, subsRes] = await Promise.all([
        loadKakaoMapScript(),
        getUserCenter(),
        favoritesStore.getFavorite(),
        api.get('/subscriptions'),
    ])

    map.value = new kakao.maps.Map(mapRef.value, {
        center: new kakao.maps.LatLng(userCenter.lat, userCenter.lng),
        level: 8,
    })

    kakao.maps.event.addListener(map.value, 'click', () => {
        selectedItem.value = null
    })

    subscriptionList.value = subsRes.data

    // 처음 렌더는 현재 탭/마감설정 반영
    renderMarkers(visibleList.value, true)
})

// =============== 탭 전환 시 ===============
watch([activeTab, () => props.showExpired, subscriptionList], () => {
    if (!map.value) return

    const list = visibleList.value
    renderMarkers(list, true)

    if (activeTab.value === 'favorite') {
        // 찜 탭에서 마커가 있다면 bounds 맞추기
        if (list.length > 0) {
            const bounds = new kakao.maps.LatLngBounds()
            list.forEach((item) => {
                const lat = parseFloat(item.latitude)
                const lng = parseFloat(item.longitude)
                if (!isNaN(lat) && !isNaN(lng)) {
                    bounds.extend(new kakao.maps.LatLng(lat, lng))
                }
            })
            map.value.setBounds(bounds)
        }
    } else {
        // 전체 탭: 서울 중심/레벨 고정 유지
        const geocoder = new kakao.maps.services.Geocoder()
        geocoder.addressSearch('서울특별시', (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
                map.value.setCenter(coords)
                map.value.setLevel(9)
            }
        })
    }
})

const close = () => {
    isFilterOpen.value = false
    filterError.value = false
}
</script>
