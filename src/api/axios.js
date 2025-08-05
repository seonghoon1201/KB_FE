import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // 인증이 필요하면
})

// 요청 인터셉터: accessToken 이 있을 때만 header 에 붙임
api.interceptors.request.use((config) => {
    const store = useUserStore()
    if (store.accessToken) {
        config.headers.Authorization = `Bearer ${store.accessToken}`
    }
    return config
})

// 응답 인터셉터: 401 Unauthorized 처리
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const store = useUserStore()
        const { config, response } = err
        const url = config.url || ''

        // /auth/ 관련은 재시도 로직 배제
        if (url.startsWith('/auth/')) {
            return Promise.reject(err)
        }

        // 401 에러만 처리
        if (response?.status === 401) {
            // 아직 retry 안 한 요청 → 토큰 리프레시 시도
            if (!config._retry) {
                config._retry = true
                try {
                    await store.refreshAccessToken()
                    // 헤더 갱신 후 원래 요청 재시도
                    config.headers.Authorization = `Bearer ${store.accessToken}`
                    return api(config)
                } catch (refreshErr) {
                    // 리프레시 실패 시 강제 로그아웃
                    await store.logout()
                    router.replace({ path: '/login' })
                    return Promise.reject(refreshErr)
                }
            } else {
                // 이미 retry 했는데도 401 → 강제 로그아웃
                await store.logout()
                router.replace({ path: '/login' })
            }
        }

        return Promise.reject(err)
    },
)

export default api
