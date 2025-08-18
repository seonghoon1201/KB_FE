// src/api/preferenceApi.js
import api from '@/api/axios'

const BASE_URL = '/user/preferences' // baseURL에 /v1 이미 붙어있다면 OK

export default {
    async getPreferences() {
        try {
            const { data } = await api.get(BASE_URL)
            return data
        } catch (err) {
            console.error('선호 조회 실패:', err?.response?.data || err)
            throw err
        }
    },

    async setPreferences(payload) {
        try {
            const { data } = await api.post(BASE_URL, payload, {
                headers: { 'Content-Type': 'application/json' },
            })
            return data // 서버에서 success 메시지를 보낸다면 여기서 확인
        } catch (err) {
            console.error('선호 저장 실패:', err?.response?.data || err)
            throw err
        }
    },
}
