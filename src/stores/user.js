// src/stores/user.js
import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '', 
        birthDate: '',
        roles: [],
        accessToken: '',
        refreshToken: '',
        isLoggedIn: false,
        // 가점 계산 관련
        score: null,
        isMarried: false,
        marriageDate: '',
    }),
    actions: {
        /**
         * 로그인 성공 후 호출
         * @param {{ access_token, refresh_token, user }} payload
         */
        setAuth({ access_token, refresh_token, user }) {
            // 1) 토큰 저장
            this.accessToken = access_token
            this.refreshToken = refresh_token
            this.isLoggedIn = true

            // 2) 유저 정보 저장
            this.id = user.user_id
            this.name = user.user_name || ''
            this.email = user.user_id
            this.address = user.address || ''
            this.birthDate = user.birthdate || ''
            this.roles = user.roles || []
            // phone / 결혼정보 등은 백엔드에서 내려주지 않으면 기본값 유지

            // 3) 로컬스토리지 & axios header
            localStorage.setItem('accessToken', access_token)
            localStorage.setItem('refreshToken', refresh_token)
            api.defaults.headers.common.Authorization = `Bearer ${access_token}`
        },

        /** refreshToken 으로 accessToken 재발급 */
        async refreshAccessToken() {
            const res = await authApi.refreshToken(this.refreshToken)
            this.accessToken = res.data.access_token
            localStorage.setItem('accessToken', this.accessToken)
            api.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`
            return this.accessToken
        },

        /** 로그아웃 */
        async logout() {
            try {
                await authApi.logout()
            } catch (e) {
                console.warn('로그아웃 API 에러:', e)
            }
            // 스토어 클리어
            this.$reset()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            delete api.defaults.headers.common.Authorization
        },

        async signout() {
            // 스토어 클리어78
            this.$reset()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            delete api.defaults.headers.common.Authorization
        },
        /** (선택) 가점 계산 결과 저장 */
        saveScore(scoreObj) {
            this.score = scoreObj
        },

        async updateProfile(payload) {
            try {
                // payload는 { address, birthdate, user_name }
                await api.put('/auth/update', payload)

                // 로컬 상태 갱신
                this.name = payload.user_name
                this.birthDate = payload.birthdate
                this.address = payload.address
            } catch (err) {
                console.error('프로필 수정 실패:', err)
                throw err
            }
        },
    },
})
