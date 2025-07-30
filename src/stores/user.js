import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: '',
        email: '',
        phone: '',
        accessToken: '',
        refreshToken: '',
        isLoggedIn: false,

        // 가점 계산 관련 (나중에 백엔드에서 받아올 수도 있음)
        score: null,
        birthDate: '',
        isMarried: false,
        marriageDate: '',
    }),
    actions: {
        /**
          로그인 성공 후 호출
          @param {{ accessToken: string, refreshToken: string, user: object }} param0
         **/
        setAuth({ access_token, refresh_token, user }) {
            // 1) 토큰 저장
            this.accessToken = access_token
            this.refreshToken = refresh_token
            this.isLoggedIn = true

            // 2) 유저 정보 저장
            this.id = user.user_id
            this.name = user.name || ''
            this.email = user.user_id
            this.phone = user.phone || ''
            this.birthDate = user.birthdate || ''
            this.isMarried = user.isMarried ?? false
            this.marriageDate = user.marriageDate || ''

            // 3) 로컬 스토리지 & axios header 세팅
            localStorage.setItem('accessToken', this.accessToken)
            localStorage.setItem('refreshToken', this.refreshToken)
            api.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`
        },

        /** refreshToken 으로 accessToken 재발급 */
        async refreshAccessToken() {
            const res = await api.post('/auth/refresh', {
                refresh_token: this.refreshToken,
            })

            const { access_token } = res.data
            this.accessToken = access_token
            localStorage.setItem('accessToken', this.accessToken)
            api.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`
        },

        /** 로그아웃 */
        logout() {
            this.id = this.name = this.email = this.phone = ''
            this.accessToken = this.refreshToken = ''
            this.isLoggedIn = false
            this.score = null
            this.birthDate = ''
            this.isMarried = false
            this.marriageDate = ''

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            delete api.defaults.headers.common.Authorization
        },

        /** (선택) 가점 계산 결과 저장 */
        saveScore(scoreObj) {
            this.score = scoreObj
        },
    },
})
