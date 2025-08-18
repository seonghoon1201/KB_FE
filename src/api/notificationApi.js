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
        const { data } = await api.delete(BASE_URL + alarmIdx)

        return data.message === '삭제 완료'
    },

    // 알람 전체 읽음 처리
    async readAll() {
        await api.patch(BASE_URL + 'read-all')
    },

    // 새 청약 공고 알람 생성
    async newNotice(params) {
        await api.post(BASE_URL + 'newnotice', params)
    },

    // 청약 접수 시작 알람 생성
    async applicationStart(params) {
        await api.post(BASE_URL + 'application-start', params)
    },

    // 예치금 미납 알람 생성
    async createDepositunpaid(params) {
        await api.post(BASE_URL + 'create-depositunpaid', params)
    },

    // -----------------------------------------------------------------------------

    // sendPush
    async sendPush(params) {
        await api.post(BASE_URL + 'send', params)
    },

    // FCM 토큰 저장/갱신
    async saveToken(token) {
        await api.put(BASE_URL + 'token', token)
    },

    // FCM 토큰 삭제(초기화)
    async deleteToken() {
        await api.delete(BASE_URL + 'token')
    },
}
