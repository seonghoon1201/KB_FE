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
            const res = await AuthApi.refreshToken(this.refreshToken)
            const { access_token } = res.data
            this.accessToken = access_token
            localStorage.setItem('accessToken', access_token)
            api.defaults.headers.common.Authorization = `Bearer ${access_token}`
            return access_token
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
    },
})
