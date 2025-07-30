import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'

import api from '@/api/axios'
import { useUserStore } from '@/stores/user'
import * as lucide from 'lucide-vue-next'

const app = createApp(App)

// 전역 아이콘 등록
for (const [key, comp] of Object.entries(lucide)) {
    app.component(key, comp)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)

// — 로그인 유지(새로고침 복원) 로직 —
const userStore = useUserStore()
const at = localStorage.getItem('accessToken')
const rt = localStorage.getItem('refreshToken')
const rawUser = localStorage.getItem('user')
if (at && rt && rawUser) {
    const user = JSON.parse(rawUser)
    userStore.setAuth({
        access_token: at,
        refresh_token: rt,
        user,
    })
}

app.mount('#app')
