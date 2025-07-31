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

            // 3) localStorage & axios header
            localStorage.setItem('accessToken', access_token)
            localStorage.setItem('refreshToken', refresh_token)
            // 유저 정보도 저장
            localStorage.setItem('user', JSON.stringify(user))

            api.defaults.headers.common.Authorization = `Bearer ${access_token}`
        },

        /** refreshToken 으로 새 accessToken 받아오기 */
        async refreshAccessToken() {
            const res = await authApi.refreshToken(this.refreshToken)
            const newToken = res.data.access_token

            this.accessToken = newToken
            localStorage.setItem('accessToken', newToken)
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`

            return newToken
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
            localStorage.removeItem('user')
            delete api.defaults.headers.common.Authorization
        },

        /** (선택) 회원탈퇴 */
        async signout(payload) {
            await authApi.signout(payload)
            return this.logout()
        },

        /** (선택) 가점 계산 결과 저장 */
        saveScore(scoreObj) {
            this.score = scoreObj
        },

        /** 프로필 수정 */
        async updateProfile(payload) {
            try {
                await api.put('/auth/update', payload)
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
