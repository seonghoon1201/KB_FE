<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
      <h1 class="text-lg font-semibold text-gray-800 text-center">청약 공고 목록</h1>
    </div>

    <!-- 필터 버튼들 (옵셔널) -->
    <div class="px-4 py-3 bg-white border-b border-gray-100 ">
      <div class="justify-center flex space-x-2 overflow-x-auto">
        <button 
          v-for="filter in filters" 
          :key="filter.key"
          @click="selectedFilter = filter.key"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
            selectedFilter === filter.key 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 공고 목록 -->
    <div class="flex-1 px-4 py-4 pb-20">
      <div v-if="filteredSubscriptions.length === 0" class="text-center py-12">
        <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
      </div>
      
      <div v-else class="space-y-4">
        <SubscriptionCard 
          v-for="subscription  in filteredSubscriptions" 
          :key="subscription.id"
          :subscription="subscription"
        />
      </div>
    </div>

    <BottomNavbar/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue';
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue';

const selectedFilter = ref('latest')

const filters = [
  { key: 'latest', label: '최신순' },
  { key: 'deadline-first', label: '마감임박순' },
  { key: 'filter', label: '필터', isCustom: true }
]


// 상세 필터 조건
const customFilterOptions = [
  { key: 'location', label: '지역' },
  { key: 'price', label: '가격대' },
  { key: 'area', label: '면적(평수)' },
]


// 필터링된 청약 공고 목록
const filteredSubscriptions = computed(() => {
  let result = [...subscriptions.value];
  
  // 정렬 적용
  switch (selectedFilter.value) {
    case 'latest':
      // 최신순 정렬 (ID 기준 내림차순)
      result.sort((a, b) => b.id - a.id);
      break;
      
    case 'deadline-first':
      // 마감임박순 정렬 (D-Day 오름차순)
      result.sort((a, b) => {
        const aDDay = calculateDDay(a.applicationPeriod);
        const bDDay = calculateDDay(b.applicationPeriod);
        
        // 마감된 것들(-값)은 맨 뒤로
        if (aDDay < 0 && bDDay >= 0) return 1;
        if (bDDay < 0 && aDDay >= 0) return -1;
        if (aDDay < 0 && bDDay < 0) return b.id - a.id; // 둘 다 마감이면 최신순
        
        return aDDay - bDDay; // D-Day 오름차순
      });
      break;
      
    case 'filter':
      // 필터 옵션은 현재 상태 유지 (추후 모달 구현 가능)
      break;
      
    default:
      // 기본은 최신순
      result.sort((a, b) => b.id - a.id);
  }
  
  return result;
});



// 샘플 청약 공고 데이터
const subscriptions = ref([
  {
    id: 1,
    title: '힐스테이트 청라 국제도시',
    location: '인천광역시 서구',
    totalUnits: 1284,
    applicationStartDate: '2025.08.15',
    applicationCompleteDate: '2025.08.17',
    status: 'available',
    type: '아파트',
    squareMeters: 104,
    price: '12억',
    completionDate: '2027.03',
  },
  {
    id: 2,
    title: '래미안 원베일리',
    location: '서울특별시 강동구',
    totalUnits: 758,
    applicationStartDate: '2025.07.21',
    applicationCompleteDate: '2025.07.22',
    type: '오피스텔',
    squareMeters: 74,
    price: '18억',
    completionDate: '2027.06',
  },
  {
    id: 3,
    title: '푸르지오 시티 동탄',
    location: '경기도 화성시',
    totalUnits: 2156,
    applicationStartDate: '2025.08.08',
    applicationCompleteDate: '2025.08.10',
    type: '아파트',
    squareMeters: 83,
    price: '15억',
    completionDate: '2027.09',
  },
  {
    id: 4,
    title: '자이 평촌 센트럴파크',
    location: '경기도 안양시 동안구',
    totalUnits: 924,
    applicationStartDate: '2025.08.25',
    applicationCompleteDate: '2025.08.27',
    status: 'upcoming',
    type: '도시형 생활주택',
    squareMeters: 104,
    price: '20억',
    completionDate: '2027.12',
  },
  {
    id: 5,
    title: '롯데캐슬 베네시티',
    location: '대구광역시 달서구',
    totalUnits: 1456,
    applicationStartDate: '2025.08.12',
    applicationCompleteDate: '2025.08.14',
    status: 'available',
    type: '아파트',
    squareMeters: 104,
    price: '9억',
    completionDate: '2027.08',
  }
])



// 필터 클릭 핸들러
const handleFilterClick = (filter) => {
  if (filter.isCustom) {
    // 필터 버튼 클릭 시 모달이나 추가 옵션 표시 (추후 구현)
    console.log('필터 옵션 열기');
    // 여기에 모달 열기 로직 추가 가능
  } else {
    selectedFilter.value = filter.key;
  }
};




</script>