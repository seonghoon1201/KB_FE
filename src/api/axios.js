import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
    baseURL: '/v1', // 프록시 타도록 /v1 으로 설정
})

// 요청 시 항상 토큰 첨부
api.interceptors.request.use((config) => {
    const store = useUserStore()
    if (store.accessToken) {
        config.headers.Authorization = `Bearer ${store.accessToken}`
    }
    return config
})

// 401 나오면 한 번만 _retry 하고 refresh 토큰으로 재발급
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const store = useUserStore()
        const { config, response } = err
        if (response?.status === 401 && !config._retry) {
            config._retry = true
            await store.refreshAccessToken()
            config.headers.Authorization = `Bearer ${store.accessToken}`
            return api(config)
        }
        return Promise.reject(err)
    },
)

export default api
