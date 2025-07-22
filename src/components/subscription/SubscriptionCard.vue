<!-- 기본 카드 컴포넌트 -->
<template>
    <div
        class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
        <!-- 상단: 제목, D-Day, 하트 -->
        <div class="flex items-start justify-between mb-3">
            <h2 class="text-lg font-bold text-gray-900 flex-1 pr-4">
                {{ subscription.title }}
            </h2>
            <div class="flex items-center gap-2 flex-shrink-0">
                <!-- D-Day 배지 -->
                <span
                    :class="getDDayBadgeClass(getDDayInfo(subscription.applicationCompleteDate).dDay)"
                    class="text-xs font-semibold px-3 py-1 rounded-md"
                >
                    {{ getDDayInfo(subscription.applicationCompleteDate).text }}
                </span>
                <!-- 하트 아이콘 -->
                <button
                    @click="toggleFavorite"
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
        </div>

        <!-- 위치 정보 -->
        <p class="text-gray-500 text-sm mb-2">
            {{ subscription.location }}
        </p>

        <!-- 하단: 날짜, 면적/층수, 버튼들 -->
        <div class="flex items-end justify-between">
            <!-- 좌측: 날짜 정보 -->
            <div class="flex flex-col gap-4">
                <span class="text-gray-500 text-sm">
                    {{ subscription.applicationStartDate }} - {{ subscription.applicationCompleteDate }}
                </span>
                <!-- 아파트 타입 버튼 -->
                <button
                    :class="getHouseTypeBadgeClass(subscription.type)"
                    class="bg-blue-50 w-fit text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                >
                    {{ subscription.type }}
                </button>
            </div>

            <!-- 우측: 버튼들 -->
            <div class="flex flex-col gap-2 items-end">
                <!-- 세대수, 가격 -->
                <span class="text-gray-500 text-md text-gray-500">
                    {{ subscription.squareMeters }}㎡ · {{ subscription.price }}
                </span>
                <!-- 상세보기 버튼 -->
                <button
                    @click="handleDetailClick"
                    class="bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-md"
                >
                    상세보기
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Heart } from 'lucide-vue-next'

// Props 정의
const props = defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: 'e편한세상 아파트',
      location: '인천시 연수구 송도동',
      totalUnits: 1000,
      applicationStartDate: '2025.07.15',
      applicationCompleteDate: '2025.07.17',
      status: 'available',
      type: '분양권',
      priceRange: '12억',
      completionDate: '2027.03',
      features: ['역세권', '대단지']
    })
  },
  favoriteDefault: {
    type: Boolean,
    default: false
  }
});

// 즐겨찾기 상태
const isFavorite = ref(props.favoriteDefault)

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    emit('favorite-changed', {
        subscriptionId: props.subscription.id,
        isFavorite: isFavorite.value,
    })
}

// D-Day 계산 함수
const getDDayInfo = (applicationCompleteDate) => {
  // applicationCompleteDate 형식: "2025.07.17"
  if (!applicationCompleteDate) return { dDay: 0, text: 'D-Day' };
  
  // 디버깅용 로그
  console.log('입력된 마감일:', applicationCompleteDate);
  
  // 날짜 파싱 (2025.07.17 -> 2025-07-17)
  const formattedDate = applicationCompleteDate.replace(/\./g, '-');
  console.log('변환된 날짜:', formattedDate);
  
  const endDate = new Date(formattedDate);
  const today = new Date();
  
  console.log('마감일:', endDate);
  console.log('오늘:', today);
  
  // 시간 제거하고 날짜만 비교
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  console.log('시간 제거 후 마감일:', endDate);
  console.log('시간 제거 후 오늘:', today);
  
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  console.log('시간 차이(밀리초):', diffTime);
  console.log('일수 차이:', diffDays);
  
  if (diffDays > 0) {
    console.log('결과: D-' + diffDays);
    return { dDay: diffDays, text: `D-${diffDays}` };
  } else if (diffDays === 0) {
    console.log('결과: D-DAY');
    return { dDay: 0, text: 'D-DAY' };
  } else {
    console.log('결과: 마감');
    return { dDay: diffDays, text: '마감' };
  }
};

// D-Day에 따른 배지 스타일
const getDDayBadgeClass = (dDay) => {
    if (dDay > 7) {
        return 'bg-blue-100 text-blue-700' // 여유있음
    } else if (dDay > 3) {
        return 'bg-yellow-100 text-yellow-700' // 곧 마감
    } else if (dDay >= 0) {
        return 'bg-red-100 text-red-700' // 임박/당일
    } else {
        return 'bg-gray-100 text-gray-700' // 마감됨
    }
}

// 집 유형에 따른 배지 스타일
const getHouseTypeBadgeClass = (type) => {
    if (type == '아파트') {
        return 'bg-blue-50 text-blue-700 border border-blue-200'
    } else if (type == '도시형 생활주택') {
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    } else if (type == '오피스텔') {
        return 'bg-red-50 text-red-700 border border-red-200'
    } else {
        return 'bg-gray-100 text-gray-700'
    }
}

// 이벤트 emit (부모 컴포넌트에서 사용할 경우)
const emit = defineEmits(['favorite-changed', 'detail-click'])

const handleDetailClick = () => {
    emit('detail-click', props.subscription)
}


</script>
