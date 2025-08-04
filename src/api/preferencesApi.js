// 선호 조건 선택 api

import api from '@/api/axios'
const BASE_URL = '/user/preferences'

export default {
    async getPreferences() {
        console.log('선호설정')
        const { data } = api.get(BASE_URL)
        console.log('선호설정 data : ', data)
        return data
    },

    async setPreferences(params) {
        console.log('선호설정')
        const { data } = api.post(BASE_URL, params)

        return data === 'Preferences saved successfully'
    },
}
