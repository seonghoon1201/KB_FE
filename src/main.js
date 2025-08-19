// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import api from '@/api/axios'
import { setupMessaging, onForegroundMessage } from '@/firebase'
import { useNotificationStore } from '@/stores/notificationStore'
import './assets/main.css'

import '@/utils/date'
import { useUserStore } from '@/stores/user'
import { useAccountStore } from '@/stores/account'
import { useScoreStore } from '@/stores/scoreStore'
import { usePreferenceStore } from '@/stores/preference'
import { useRecommendationStore } from '@/stores/recommendation'
import * as lucide from 'lucide-vue-next'

// ant design
import Antd from 'ant-design-vue'
/* 마진 생겨서 일단 주석 처리 
import 'ant-design-vue/dist/reset.css' // CSS 리셋 포함 (4.x 기준)
*/

// 애니메이션 효과
import 'animate.css'

const app = createApp(App)

async function initFcmAfterLogin() {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
        const { token } = await setupMessaging(vapidKey)
        if (!token) return
        // 서버에 토큰 저장
        await api.put('/alarm/token', { fcm_token: token }) // JWT 인증 필요 시 헤더 자동 첨부 가정

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
app.use(Antd)

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

    initFcmAfterLogin()
}

// — 로그인 시 자동으로 현재 입력값 기준 가점 계산하기 —
const scoreStore = useScoreStore()
scoreStore.calculateScore().catch(() => {})

// — 계좌 스토어 복원 & 저장(퍼시스트) —
const accountStore = useAccountStore()

// — 선호 스토어 복원 & 저장(퍼시스트) —
const prefStore = usePreferenceStore()
// 1) 로컬스토리지에 남아있으면 우선 복원
const rawPref = localStorage.getItem('preferenceStore')
if (rawPref) {
    try {
        prefStore.$patch(JSON.parse(rawPref))
    } catch (e) {
        console.warn('선호 스토어 복원 실패:', e)
    }
}
// 2) 변경시 항상 저장(필요한 필드만)
prefStore.$subscribe((_, state) => {
    const toPersist = {
        isSet: state.isSet,
        regions: state.regions,
        area: state.area,
        priceRange: state.priceRange,
        types: state.types,
    }
    localStorage.setItem('preferenceStore', JSON.stringify(toPersist))
})

// — 추천: 선호 복원 후 서버 동기화 → 추천 재요청
const recStore = useRecommendationStore()
;(async () => {
    // 로그인 상태라면 서버 선호 동기화
    if (userStore.isLoggedIn && userStore.accessToken) {
        try {
            await prefStore.hydrate() // 서버 응답이 비정상이면 내부에서 로컬 상태 유지
        } catch (e) {
            console.warn('[초기 선호 동기화 실패]', e?.response?.status)
        }
    }
    // 선호가 설정돼 있으면 추천 요청(백엔드/로컬 폴백은 recStore.fetch가 처리)
    if (prefStore.isSet) {
        try {
            await recStore.fetch()
        } catch (e) {
            console.warn('[초기 추천 로딩 실패]', e)
        }
    }
})()

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
