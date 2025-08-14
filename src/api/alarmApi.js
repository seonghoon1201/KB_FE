// 외부 api

import api from '@/api/axios'
const BASE_URL = '/api/token'

export default {
    // fcm 토큰 저장
    async tokenUpdate(token) {
        const params = { fcm_token: token }
        return await api.put(BASE_URL, params)
    },

    // fcm 토큰 삭제
    async tokenDelete() {
        return await api.delete(BASE_URL)
    },
}
