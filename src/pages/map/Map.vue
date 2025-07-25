<template>
  <div class="relative min-h-screen bg-white pb-20">
    <!-- ✅ 상단 헤더 -->
    <BackHeader title="청약 지도" />

    <!-- ✅ 상단 탭 -->
    <div class="fixed top-[56px] left-0 right-0 z-30 bg-white px-4 py-2 flex justify-center gap-2">
      <button
        class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
        :class="activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'"
        @click="activeTab = 'all'"
      >
        전체 청약 지도
      </button> 
      <button
        class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
        :class="activeTab === 'favorite' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'"
        @click="activeTab = 'favorite'"
      >
        찜한 청약 지도
      </button>
    </div>

    <!-- ✅ 지도 -->
    <div ref="mapRef" class="w-full" :style="mapHeightStyle" />

    <!-- ✅ 청약 상세 카드 -->
    <div
      v-if="selectedItem"
      class="absolute left-4 right-4 bottom-24 z-20"
    >
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

// 더미 청약 데이터
const dummyList = [
  {
    id: 1,
    title: '힐스테이트 청약',
    lat: 37.5658,
    lng: 126.9780,
    city: '서울시',
    district: '강남구',
    applicationStartDate: '2025.08.10',
    applicationCompleteDate: '2025.08.12',
    squareMeters: 104,
    price: '800000000',
    type: '아파트',
    isFavorite: false
  },
  {
    id: 2,
    title: '자이 청약',
    lat: 37.5700,
    lng: 126.9820,
    city: '서울시',
    district: '마포구',
    applicationStartDate: '2025.09.01',
    applicationCompleteDate: '2025.09.05',
    squareMeters: 84,
    price: '600000000',
    type: '아파트',
    isFavorite: true
  }
]


const mapRef = ref(null)
const map = ref(null)
const markers = ref([])
const selectedItem = ref(null)
const activeTab = ref('all')

// 지도 높이 계산
const mapHeightStyle = computed(() => {
  return {
    height: `calc(100vh - 56px - 52px - 60px)` // 헤더 + 탭 + 하단바
  }
})

onMounted(async () => {
  const kakao = await loadKakaoMapScript()

  map.value = new kakao.maps.Map(mapRef.value, {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 6
  })

  renderMarkers()
})

// 마커 렌더링
const renderMarkers = () => {
  const kakao = window.kakao
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  const filtered = activeTab.value === 'favorite'
    ? dummyList.filter(item => item.isFavorite)
    : dummyList

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
</script>
