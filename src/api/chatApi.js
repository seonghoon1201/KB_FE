// 외부 api

import api from '@/api/axios'
const BASE_URL = '/chatbot'

export default {
    async sendMessage(message) {
        const { data } = await api.post(BASE_URL, { message })
        console.log('data : ', data)

        return data ? data.response : '답변을 불러오지 못했습니다.'
    },
}
