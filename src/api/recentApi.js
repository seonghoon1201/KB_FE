// 최근 본 공고 api

import api from '@/api/axios'
const BASE_URL = '/recentview/'

export default {
    async getRecentView() {
        try {
            const { data } = await api.get(BASE_URL)

            console.log('getRecentView data : ', data)

            return data
        } catch (e) {
            console.log('error : ', e)
        }
    },
}
