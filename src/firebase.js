// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)

let messaging = null

// [추가] 루트의 SW를 찾아 재사용하거나, 없으면 등록하는 헬퍼
async function getOrRegisterFCMServiceWorker() {
    // 이미 등록된 SW 중에서 firebase-messaging-sw.js가 있으면 재사용
    const regs = await navigator.serviceWorker?.getRegistrations?.()
    const found = regs?.find(
        (r) =>
            r.active?.scriptURL?.endsWith('/firebase-messaging-sw.js') ||
            r.installing?.scriptURL?.endsWith('/firebase-messaging-sw.js') ||
            r.waiting?.scriptURL?.endsWith('/firebase-messaging-sw.js'),
    )
    if (found) return found

    // 없으면 루트(/public)에 있는 파일을 등록
    // Vite 기준 /public/firebase-messaging-sw.js → 배포 시 /firebase-messaging-sw.js 로 노출
    return navigator.serviceWorker.register('/firebase-messaging-sw.js')
}

export async function setupMessaging(vapidKey) {
    console.log('vapidKey : ', vapidKey)
    const supported = await isSupported()
    console.log('supported : ', supported)
    if (!supported) return null

    // [추가] 웹 알림 권한 요청 (거부 시 토큰 발급 불가)
    const perm = await Notification.requestPermission()
    console.log('perm : ', perm)
    if (perm !== 'granted') return null

    messaging = getMessaging(firebaseApp)

    // [핵심 변경] 루트의 SW를 명시적으로 넘겨 안정적으로 getToken 수행
    const swReg = await getOrRegisterFCMServiceWorker()
    console.log('swReg : ', swReg)

    // 이미 루트에 firebase-messaging-sw.js가 있으므로 import 불필요
    const token = await getToken(messaging, {
        vapidKey, // Web 푸시용 VAPID
        serviceWorkerRegistration: swReg, // 루트 SW 명시
    })

    console.log('token : ', token)

    if (token) {
        localStorage.setItem('fcmToken', token) // 로컬 스토리지 저장
    }

    return { messaging, token }
}

// 포그라운드 메시지 수신 핸들러 등록 (Pinia로 넘길 예정)
export function onForegroundMessage(callback) {
    if (!messaging) return
    console.log('callback : ', callback)
    onMessage(messaging, (payload) => {
        callback?.(payload)
    })
}
