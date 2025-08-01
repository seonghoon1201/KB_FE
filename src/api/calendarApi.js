// 캘린더 api

import api from '@/api/axios'

const BASE_URL = '/me/favorite/'

// 현재 년월일에서 일을 +- 일 한 결과 리턴.
Date.prototype.addDays = function (days) {
    let date = this
    return new Date(date.setDate(date.getDate() + days))
}

export default {
    async getData() {
        const { data } = await api.get(`${BASE_URL}list`)

        let returnData = [
            {
                id: '11111',
                title: 'test',
                start: '2025-07-08',
                end: '2025-07-12',
                allDay: true,
                maxArea: 'test',
                minArea: 'test',
                maxPrice: 'test',
                minPrice: 'test',
                si: 'test',
                sigungu: 'test',

                house_nm: 'test',
                application_period: 'test',
                application_start_date: 'test',
                application_end_date: 'test',
                city: 'test',
                district: 'test',
                house_type: 'test',
                pblanc_no: 'test',
                min_price: 'test',
                min_area: 'test',

                favorites: true,
            },
            {
                id: '11111',
                title: 'test',
                start: '2025-07-21',
                end: '2025-07-24',
                allDay: true,
                maxArea: 'test',
                minArea: 'test',
                maxPrice: 'test',
                minPrice: 'test',
                si: 'test',
                sigungu: 'test',

                house_nm: 'test',
                application_period: 'test',
                application_start_date: 'test',
                application_end_date: 'test',
                city: 'test',
                district: 'test',
                house_type: 'test',
                pblanc_no: 'test',
                min_price: 'test',
                min_area: 'test',
                favorites: true,
            },
            {
                id: '11111',
                title: 'test',
                start: '2025-07-30',
                end: '2025-08-02',
                allDay: true,
                maxArea: 'test',
                minArea: 'test',
                maxPrice: 'test',
                minPrice: 'test',
                si: 'test',
                sigungu: 'test',

                house_nm: 'test',
                application_period: 'test',
                application_start_date: 'test',
                application_end_date: 'test',
                city: 'test',
                district: 'test',
                house_type: 'test',
                pblanc_no: 'test',
                min_price: 'test',
                min_area: 'test',
                favorites: true,
            },
        ]

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
                city: date[1],
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
