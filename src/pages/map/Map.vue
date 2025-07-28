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

// 더미 청약 데이터
const dummyList = [
    {
        id: 1,
        title: '힐스테이트 청약',
        lat: 37.5658,
        lng: 126.978,
        city: '서울시',
        district: '강남구',
        applicationStartDate: '2025.08.10',
        applicationCompleteDate: '2025.08.12',
        squareMeters: 104,
        price: '800000000',
        type: '아파트',
        isFavorite: false,
    },
    {
        id: 2,
        title: '자이 청약',
        lat: 37.57,
        lng: 126.982,
        city: '서울시',
        district: '마포구',
        applicationStartDate: '2025.09.01',
        applicationCompleteDate: '2025.09.05',
        squareMeters: 84,
        price: '600000000',
        type: '아파트',
        isFavorite: true,
    },
]

const mapRef = ref(null)
const map = ref(null)
const markers = ref([])
const selectedItem = ref(null)
const activeTab = ref('all')

// 필터 데이터 초기값
const isFilterOpen = ref(false)
const filterError = ref(false)
const selectedCity = ref('')
const selectedDistrict = ref('')

const cities = Object.keys(districts)
const filteredDistricts = computed(() => districts[selectedCity.value] || [])

// 필터 적용 버튼 클릭 시 동작
const applyFilters = async () => {
    const kakao = await loadKakaoMapScript()
    const geocoder = new kakao.maps.services.Geocoder()

    // 주소 문자열 생성 (ex: "서울시 강남구")
    const address = `${selectedCity.value} ${selectedDistrict.value}`

    if (selectedDistrict.value == '') {
        // isFilterOpen.value = false
        filterError.value = true
        return
    }

    geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x)

            // 지도 중심 이동
            map.value.setCenter(coords)
        } else {
            console.warn('❌ 주소를 찾을 수 없습니다:', address)
        }
    })

    // 에러 닫기
    filterError.value = false

    // 모달 닫기
    isFilterOpen.value = false
}

// 지도 높이 계산
const mapHeightStyle = computed(() => {
    return {
        height: `calc(100vh - 56px - 52px - 60px)`, // 헤더 + 탭 + 하단바
    }
})

onMounted(async () => {
    const kakao = await loadKakaoMapScript()

    map.value = new kakao.maps.Map(mapRef.value, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 6,
    })

    renderMarkers()
})

// 마커 렌더링
const renderMarkers = () => {
    const kakao = window.kakao
    markers.value.forEach((marker) => marker.setMap(null))
    markers.value = []

    const filtered =
        activeTab.value === 'favorite' ? dummyList.filter((item) => item.isFavorite) : dummyList

    filtered.forEach((item) => {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(item.lat, item.lng),
            map: map.value,
        })

        kakao.maps.event.addListener(marker, 'click', () => {
            selectedItem.value = item
        })

        markers.value.push(marker)
    })
}

// 즐겨찾기 toggle
const toggleFavorite = (item) => {
    item.isFavorite = !item.isFavorite
}

// 탭 변경 시 마커 재렌더
watch(activeTab, () => {
    selectedItem.value = null
    renderMarkers()
})

// ✅ 시/도가 변경될 때 군/구 초기화
watch(selectedCity, () => {
    selectedDistrict.value = ''
})
</script>
