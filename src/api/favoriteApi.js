// 즐겨찾기 api

import api from '@/api/axios'

const BASE_URL = '/me/favorite'

export default {
    // 즐겨찾기 목록 조회
    async initializeFavorites() {
        try {
            const { data } = await api.get(`${BASE_URL}/list`)

            let tempArr = []
            data.map((item) => {
                let date = item.application_period.split(' ~ ')
                let startDate = date[0]
                let endDate = new Date(date[1]).addDays(1) // 사용하는 달력 특성 상, endDate 1일 전까지만 표시됨.

                tempArr.push({
                    // 달력에 필요한 데이터
                    id: item.pblanc_no,
                    title: item.house_nm,
                    start: new Date().dateStringFormat(startDate, '-'),
                    end: new Date().dateStringFormat(endDate, '-'),
                    allDay: true,

                    // 기타 정보들
                    pblanc_no: item.pblanc_no,
                    house_nm: item.house_nm,
                    house_type: item.house_type,
                    city: item.si,
                    district: item.sigungu,
                    hssply_adres: item.hssply_adres,
                    application_period: item.application_period,
                    application_start_date: date[0],
                    application_end_date: date[1],
                    min_area: item.min_area,
                    max_area: item.max_area,
                    min_price: item.min_price,
                    max_price: item.max_price,
                    is_favorite: true,
                })
            })

            return tempArr
        } catch (err) {
            console.error('즐겨찾기 목록 로드 실패', err)
        }
    },

    // 즐겨찾기 추가
    async addFavorite(params) {
        try {
            const { data } = await api.post(BASE_URL, params)
            return data
        } catch (err) {
            console.error('즐겨찾기 추가 실패', err)
        }
    },

    // 즐겨찾기 삭제
    async removeFavorite(params) {
        try {
            const { data } = await api.delete(BASE_URL, { params: params })
            return data
        } catch (err) {
            console.error('즐겨찾기 삭제 실패', err)
        }
    },
}
