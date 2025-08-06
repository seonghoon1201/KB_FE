import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useSubscriptionsStore = defineStore('subscription', () => {
    const subscriptions = ref([])
    const loading = ref(false)

    // 서버에서 청약 공고 불러오기
    async function fetchSubscriptions() {
        loading.value = true
        try {
            console.log('API 호출 시작')
            const res = await api.get('/subscriptions')
            console.log('API 응답:', res)

            subscriptions.value = res.data.map((item) => {
                // application_period 분리
                let [startDate, endDate] = item.application_period.split('~').map((s) => s.trim())

                // 가격 숫자 변환
                let minPrice = Number(item.min_price)
                let maxPrice = Number(item.max_price)

                // 가격 유효성 검사 및 swap
                if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
                    const temp = minPrice
                    minPrice = maxPrice
                    maxPrice = temp
                }

                return {
                    id: item.pblanc_no, // 이제 pblanc_no가 고유 키
                    pblanc_no: item.pblanc_no,
                    house_nm: item.house_nm,
                    house_type: item.house_type,
                    city: item.si,
                    district: item.sigungu,
                    hssply_adres: item.hssply_adres,
                    application_period: item.application_period,
                    application_start_date: startDate,
                    application_end_date: endDate,
                    min_area: item.min_area,
                    max_area: item.max_area,
                    min_price: minPrice,
                    max_price: maxPrice,
                    is_favorite: item.is_favorite,
                    lat: Number(item.latitude),
                    long: Number(item.longitude)
                }
            })

            console.log('최종 가공된 데이터:', JSON.parse(JSON.stringify(subscriptions.value)))
        } catch (err) {
            console.error('청약 목록 로드 실패:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        subscriptions,
        loading,
        fetchSubscriptions,
    }
})
