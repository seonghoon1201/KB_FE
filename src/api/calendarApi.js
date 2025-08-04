// 캘린더 api

import api from '@/api/axios'

const BASE_URL = '/me/favorite/'

export default {
    async getData() {
        const { data } = await api.get(`${BASE_URL}list`)

        let returnData = []

        data.map((item, index) => {
            let date = item.application_period.split(' ~ ')
            let startDate = date[0]
            let endDate = new Date(date[1]).addDays(1) // 사용하는 달력 특성 상, endDate 1일 전까지만 표시됨.

            returnData.push({
                id: item.pblanc_no,
                title: item.house_nm,
                start: new Date().dateStringFormat(startDate, '-'),
                end: new Date().dateStringFormat(endDate, '-'), // 달력 개발자 개새...
                allDay: true,
                // 기타 정보들
                maxArea: item.max_area,
                minArea: item.min_area,
                maxPrice: item.max_price,
                minPrice: item.min_price,
                si: item.si,
                sigungu: item.sigungu,

                house_nm: item.house_nm,
                application_period: item.application_period,
                application_start_date: date[0],
                application_end_date: date[1],
                city: item.si,
                district: item.sigungu,
                house_type: 'APT',
                pblanc_no: item.pblanc_no,
                min_price: item.max_price, // 단위: 만원
                min_area: item.max_area,

                favorites: true,
            })
        })
        console.log('returnData : ', returnData)
        return returnData
    },
}
