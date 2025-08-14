// /public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

self.addEventListener('install', function (e) {
    console.log('fcm service worker가 설치되었습니다.')
    self.skipWaiting()
})

self.addEventListener('activate', function (e) {
    console.log('fcm service worker가 실행되었습니다.')
})

const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: 'zibi-b79d7',
    storageBucket: '',
    messagingSenderId: '274112151209',
    appId: '',
    measurementId: '',
}

// 파이어베이스 초기화
firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    // [추가] notification payload면 브라우저가 자동 표시하므로 중복 방지
    // if (payload && payload.notification) return
    // const notificationTitle = payload.title
    // const notificationOptions = {
    //     body: payload.body,
    // }
    // self.registration.showNotification(notificationTitle, notificationOptions)
})
