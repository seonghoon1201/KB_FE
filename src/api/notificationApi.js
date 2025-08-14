// 외부 api
import api from '@/api/axios'
const BASE_URL = '/alarm/'

export default {
    // 알람 목록 전체 조회
    async getList(onlyUnread = false) {
        const { data } = await api.get(BASE_URL + 'list', {
            params: { onlyUnread },
        })

        return data
    },

    // 알람 상세조회
    async getItem(alarmIdx) {
        const { data } = await api.get(BASE_URL + alarmIdx)

        return data
    },

    // 알람 전체 삭제
    async deleteList() {
        await api.delete(BASE_URL + 'all')
    },

    // 알람 단건 삭제
    async deleteItem(alarmIdx) {
        await api.delete(BASE_URL + alarmIdx)
    },

    // 알람 전체 읽음 처리
    async readAll() {
        await api.patch(BASE_URL + 'read-all')
    },

    async newNotice(params) {
        await api.post(BASE_URL + 'newnotice', params)
    },
}
