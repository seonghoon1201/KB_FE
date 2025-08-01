// src/stores/user.js
import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
    state: () => {
        // 1) 로컬스토리지에 저장된 user 불러오기
        const saved = JSON.parse(localStorage.getItem('user') || '{}')
        const accessToken = localStorage.getItem('accessToken') || ''
        const refreshToken = localStorage.getItem('refreshToken') || ''

        return {
            id: saved.user_id || null,
            name: saved.user_name || '',
            email: saved.user_id || '',
            phone: saved.phone || '',
            address: saved.address || '',
            birthDate: saved.birthdate || '',
            roles: saved.roles || [],

            accessToken,
            refreshToken,
            isLoggedIn: !!accessToken,

            // 가점 계산 관련
            score: null,
            isMarried: false,
            marriageDate: '',
        }
    },
    actions: {
        setAuth({ access_token, refresh_token, user }) {
            // --- 1) 상태 업데이트 ---
            this.accessToken = access_token
            this.refreshToken = refresh_token
            this.isLoggedIn = true

            this.id = user.user_id
            this.name = user.user_name || ''
            this.email = user.user_id
            this.address = user.address || ''
            this.birthDate = user.birthdate || ''
            this.roles = user.roles || []

            // --- 2) 로컬에 저장 ---
            localStorage.setItem('accessToken', access_token)
            localStorage.setItem('refreshToken', refresh_token)
            localStorage.setItem('user', JSON.stringify(user))

            api.defaults.headers.common.Authorization = `Bearer ${access_token}`
        },

        async refreshAccessToken() {
            const res = await authApi.refreshToken(this.refreshToken)
            const newToken = res.data.access_token

            this.accessToken = newToken
            localStorage.setItem('accessToken', newToken)
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`

            return newToken
        },

        async logout() {
            try {
                await authApi.logout()
            } catch {}
            this.$reset()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            delete api.defaults.headers.common.Authorization
        },

        async signout(payload) {
            await authApi.signout(payload)
            return this.logout()
        },

        saveScore(scoreObj) {
            this.score = scoreObj
        },

        async updateProfile(payload) {
            // payload = { user_name, birthdate, address }
            try {
                await api.put('/auth/update', payload)

                // 1) 스토어 업데이트
                this.name = payload.user_name
                this.birthDate = payload.birthdate
                this.address = payload.address

                // 2) 로컬스토리지 user 갱신
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                const updated = {
                    ...user,
                    user_name: payload.user_name,
                    birthdate: payload.birthdate,
                    address: payload.address,
                }
                localStorage.setItem('user', JSON.stringify(updated))
            } catch (err) {
                console.error('프로필 수정 실패:', err)
                throw err
            }
        },
    },
})
