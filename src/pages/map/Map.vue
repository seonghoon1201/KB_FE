<template>
    <div class="relative min-h-screen bg-white pb-20">
        <!-- ✅ 상단 헤더 -->
        <BackHeader title="청약 지도" />

        <!-- ✅ 상단 탭 -->
        <div
            class="fixed top-[56px] left-0 right-0 z-30 bg-white px-4 py-2 flex justify-between gap-2"
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
            <div class="flex-1 flex justify-end">
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
            <SubscriptionCard :subscription="selectedItem" />
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
import api from '@/api/axios'

const subscriptionList = ref([]) // 전체 공고 리스트 (서울 포함)
const coordsCache = {} // 주소 → {lat, lng}

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

// ------------------- 유틸 함수 -------------------

// 주소를 좌표로 변환 (캐싱)
async function getCoords(addr) {
    if (coordsCache[addr]) return coordsCache[addr]
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

// 모든 공고 좌표를 한 번에 준비
async function prepareCoords(list) {
    for (const item of list) {
        const addr = `${item.si} ${item.sigungu}`
        if (!coordsCache[addr]) {
            await getCoords(addr)
        }
    }
}

// 마커 렌더링
function renderMarkers(list, skipBoundsCheck = false) {
    const kakao = window.kakao
    markers.value.forEach((m) => m.setMap(null))
    markers.value = []

    let bounds = null
    if (!skipBoundsCheck) {
        bounds = map.value.getBounds()
        if (!bounds || typeof bounds.contains !== 'function') return
    }

    let index = 0
    function addNext() {
        const batch = 20 // 한 프레임당 20개씩 찍기
        const end = Math.min(index + batch, list.length)
        for (; index < end; index++) {
            const item = list[index]
            const coords = coordsCache[`${item.si} ${item.sigungu}`]
            if (!coords) continue
            const pos = new kakao.maps.LatLng(coords.lat, coords.lng)
            if (!skipBoundsCheck && !bounds.contains(pos)) continue

            const marker = new kakao.maps.Marker({ position: pos, map: map.value })
            kakao.maps.event.addListener(marker, 'click', () => {
                selectedItem.value = item
            })
            markers.value.push(marker)
        }
        if (index < list.length) {
            requestAnimationFrame(addNext)
        }
    }
    requestAnimationFrame(addNext)
}

// ------------------- 필터 버튼 -------------------
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
        }
    })
    filterError.value = false
    isFilterOpen.value = false
}

// ------------------- onMounted -------------------
onMounted(async () => {
    const kakao = await loadKakaoMapScript()
    map.value = new kakao.maps.Map(mapRef.value, {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
        level: 9,
    })

    // 1. 전체 청약 리스트 가져오기
    const res = await api.get('/subscriptions')
    subscriptionList.value = res.data

    // 2. 모든 공고 좌표 미리 캐싱
    await prepareCoords(subscriptionList.value)

    // 3. 모든 마커 한 번에 찍기 (skipBoundsCheck = true)
    renderMarkers(subscriptionList.value, true)

    // 4. 지도 중심만 서울로 이동
    const geocoder = new kakao.maps.services.Geocoder()
    geocoder.addressSearch('서울특별시', (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
            map.value.setCenter(coords)
        }
    })
})

// 탭 변경 시
watch(activeTab, () => {
    const bounds = map.value.getBounds()
    const visible = subscriptionList.value.filter((item) => {
        const coords = coordsCache[`${item.si} ${item.sigungu}`]
        if (!coords) return false
        const pos = new kakao.maps.LatLng(coords.lat, coords.lng)
        return bounds.contains(pos)
    })
    renderMarkers(visible)
})

// 시/도 선택 초기화
watch(selectedCity, () => {
    selectedDistrict.value = ''
})
</script>
