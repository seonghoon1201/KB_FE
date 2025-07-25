// 청약 리스트 스토어

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSubscriptionsStore = defineStore('subscription', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

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
    },
])

    return { count, doubleCount, increment, subscriptions }
})
