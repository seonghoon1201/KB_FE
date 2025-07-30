// src/api/axios.js
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
    baseURL: '/v1',
})

// 요청 인터셉터: accessToken 이 있을 때만 header 에 붙임
api.interceptors.request.use((config) => {
    const store = useUserStore()
    if (store.accessToken) {
        config.headers.Authorization = `Bearer ${store.accessToken}`
    }
    return config
})

// 응답 인터셉터: 401 나오면 한 번만 토큰 리프레시
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const store = useUserStore()
        const { config, response } = err
        const url = config.url || ''

        // auth API는 재시도 로직 무시
        if (url.startsWith('/auth/')) {
            return Promise.reject(err)
        }

        // 그 외 401 에러는 한 번만 재발급
        if (response?.status === 401 && !config._retry) {
            config._retry = true
            try {
                await store.refreshAccessToken()
                config.headers.Authorization = `Bearer ${store.accessToken}`
                return api(config)
            } catch (refreshErr) {
                return Promise.reject(refreshErr)
            }
        }

        return Promise.reject(err)
    },
)

export default api
