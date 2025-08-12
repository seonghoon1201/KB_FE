// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { setupMessaging, onForegroundMessage } from '@/firebase'
import { useNotificationStore } from '@/stores/notificationStore'
import './assets/main.css'

import '@/utils/date'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'
import * as lucide from 'lucide-vue-next'

const app = createApp(App)

async function initFcmAfterLogin() {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
        const { token } = await setupMessaging(vapidKey)
        if (!token) return
        // 서버에 토큰 저장
        await axios.post('/v1/me/fcm-token', { token }) // JWT 인증 필요 시 헤더 자동 첨부 가정

        const store = useNotificationStore()
        onForegroundMessage((payload) => {
            // 포그라운드 수신 → 인앱 토스트/리스트 반영
            store.add(payload)
        })
    } catch (e) {
        console.error('FCM 초기화 실패:', e)
    }
}

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
    userStore.setAuth({
        access_token: at,
        refresh_token: rt,
        user: JSON.parse(rawUser),
    })
}

// — 로그인 시 자동으로 현재 입력값 기준 가점 계산하기 —
const scoreStore = useScoreStore()
scoreStore.calculateScore().catch(() => {})

// — 계좌 스토어 복원 & 저장(퍼시스트) —
const accountStore = useAccountStore()

// 1) 새로고침 시 로컬스토리지에 남아있는 상태가 있으면 복원
const rawAccount = localStorage.getItem('accountStore')
if (rawAccount) {
    try {
        accountStore.$patch(JSON.parse(rawAccount))
        // 등록되어 있으면, 최신 정보로 갱신
        if (accountStore.isRegistered) {
            accountStore.fetchAccount()
        }
    } catch (e) {
        console.warn('계좌 스토어 복원 실패:', e)
    }
}

// 2) 스토어 변경이 있을 때마다 로컬스토리지에 저장
accountStore.$subscribe((_, state) => {
    // 직렬화 가능한 부분만 저장
    const toPersist = {
        selectedBankName: state.selectedBankName,
        selectedBankCode: state.selectedBankCode,
        selectedBankLogo: state.selectedBankLogo,
        // API에서 받아온 정보도 원한다면 함께 저장
        accountDisplay: state.accountDisplay,
        accountBalance: state.accountBalance,
        accountStartDate: state.accountStartDate,
        resAccount: state.resAccount,
        resAccountName: state.resAccountName,
        resFinalRoundNo: state.resFinalRoundNo,
        resAccountTrDate: state.resAccountTrDate,
        isPayment: state.isPayment,
    }
    localStorage.setItem('accountStore', JSON.stringify(toPersist))
})

app.mount('#app')
