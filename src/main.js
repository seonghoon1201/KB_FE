import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'

// axios 인스턴스
import api from '@/api/axios'
// 유저 스토어
import { useUserStore } from '@/stores/user'
// lucide 아이콘
import * as lucide from 'lucide-vue-next'

const app = createApp(App)

// 전역 아이콘 등록
for (const [key, comp] of Object.entries(lucide)) {
    app.component(key, comp)
}

// Pinia, Router 적용
const pinia = createPinia()
app.use(pinia)
app.use(router)

// — 토큰 복원 로직 —
const userStore = useUserStore()
const at = localStorage.getItem('accessToken')
const rt = localStorage.getItem('refreshToken')
if (at && rt) {
    userStore.accessToken = at
    userStore.refreshToken = rt
    userStore.isLoggedIn = true
    api.defaults.headers.common.Authorization = `Bearer ${at}`
}
// ——————————————

app.mount('#app')
