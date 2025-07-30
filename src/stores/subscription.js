import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useSubscriptionsStore = defineStore('subscription', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    const subscriptions = ref([])
    const loading = ref(false)

    function parseAddress(addr) {
        // 예: "경기도 의정부시 가능동 123-45"
        if (!addr) return { city: '', district: '' }
        const parts = addr.split(' ')
        return {
            city: parts[0] || '',
            district: parts[1] || '',
        }
    }

    // 서버에서 청약 공고 불러오기
    async function fetchSubscriptions() {
        loading.value = true
        try {
            console.log('API 호출 시작') // <-- 추가
            const res = await api.get('/subscriptions')
            console.log('API 응답:', res) // <-- 추가

            subscriptions.value = res.data.map((item, index) => {
                console.log('원본 item:', item) // <-- 추가
                const { city, district } = parseAddress(item.hssply_adres)
                // 잘됨
                console.log(parseAddress('경기도 의정부시 가능동 123-45'))

                let start_date = ''
                let end_date = ''
                if (item.application_period) {
                    const parts = item.application_period.split('~')
                    start_date = parts[0]?.trim()
                    end_date = parts[1]?.trim()
                }
                return {
                    id: item.notice_idx ?? item.apt_idx ?? item.offi_idx,
                    house_nm: item.house_nm,
                    house_type: item.house_type,
                    city,
                    district,
                    hssply_adres: item.hssply_adres,
                    application_start_date: start_date,
                    application_end_date: end_date,
                    suply_ar: item.suply_ar,
                    lttot_top_amount: item.lttot_top_amount,
                }
            })

            // 로그 2번 찍기 (Proxy 그대로 vs 실제 배열)
            console.log('최종 가공된 데이터(Proxy):', subscriptions.value)
            console.log('toRaw:', JSON.parse(JSON.stringify(subscriptions.value)))
        } catch (err) {
            console.error('청약 목록 로드 실패:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        count,
        doubleCount,
        increment,
        subscriptions,
        loading,
        fetchSubscriptions,
    }
})
