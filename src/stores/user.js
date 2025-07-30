// src/stores/user.js
import { defineStore } from 'pinia'
import AuthApi from '@/api/authApi'
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
        score: null,
        birthDate: '',
        isMarried: false,
        marriageDate: '',
    }),
    actions: {
        setAuth({ access_token, refresh_token, user }) {
            this.accessToken = access_token
            this.refreshToken = refresh_token
            this.isLoggedIn = true

            this.id = user.user_id
            this.name = user.name || ''
            this.email = user.user_id
            this.phone = user.phone || ''
            this.birthDate = user.birthdate || ''
            this.isMarried = user.isMarried ?? false
            this.marriageDate = user.marriageDate || ''

            localStorage.setItem('accessToken', access_token)
            localStorage.setItem('refreshToken', refresh_token)
            api.defaults.headers.common.Authorization = `Bearer ${access_token}`
        },

        async refreshAccessToken() {
            try {
                const res = await api.post('/auth/refresh', {
                    refreshToken: this.refreshToken,
                })
                const newToken = res.data.accessToken
                this.accessToken = newToken
                localStorage.setItem('accessToken', newToken)
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`
                console.log('토큰 갱신 성공')
            } catch (err) {
                console.error('토큰 갱신 실패', err)
                this.isLoggedIn = false
                this.accessToken = null
                this.refreshToken = null
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                throw err
            }
        },

        async logout() {
            try {
                await AuthApi.logout()
            } catch (e) {
                // 401 등 에러는 무시
                console.warn('로그아웃 API 에러:', e)
            }
            this.id = null
            this.name = ''
            this.email = ''
            this.phone = ''
            this.accessToken = ''
            this.refreshToken = ''
            this.isLoggedIn = false
            this.score = null
            this.birthDate = ''
            this.isMarried = false
            this.marriageDate = ''

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            delete api.defaults.headers.common.Authorization
        },

        saveScore(scoreObj) {
            this.score = scoreObj
        },

        async updateProfile(payload) {
            try {
                const res = await api.put('/me/profile', payload)
                // 서버에서 변경된 데이터를 다시 state에 반영
                this.name = payload.user_name
                this.birthDate = payload.birthdate
                // address도 관리하려면 state에 추가해야 함
            } catch (err) {
                console.error('프로필 업데이트 실패:', err)
                throw err
            }
        },
    },
})
