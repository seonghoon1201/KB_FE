// src/api/accountApi.js
import api from './axios' // baseURL: http://localhost:8080/v1

export default {
    /**
     * 은행 로그인(계좌 연결) 요청
     * @param {{ id, organization, bank_name, password }} data
     * @returns Promise<AxiosResponse>
     */
    connect(data) {
        return api.post('/account/connect', data)
    },

    /**
     * 연결된 계좌 정보 조회
     * @returns Promise<AxiosResponse>
     */
    fetch() {
        return api.get('/account')
    },

    /**
     * 계좌 해지
     * @returns Promise<AxiosResponse>
     */
    disconnect() {
        return api.delete('/account')
    },
}
