import { createRouter, createWebHistory } from 'vue-router'

// ✅ 단독 페이지들 (이제 모두 레이아웃 없이 사용)
import Home from '@/pages/home/Home.vue'
import Calculator from '@/pages/calculator/Calculator.vue'
import Preference from '@/pages/preference/Preference.vue'
import Chatbot from '@/pages/chatbot/Chatbot.vue'
import Notification from '@/pages/notification/Notification.vue'
import NotoficationDetail from '@/pages/notification/NotoficationDetail.vue'
import SubscriptionList from '@/pages/subscription/SubscriptionList.vue'
import SubscriptionDetail from '@/pages/subscription/SubscriptionDetail.vue'
import FavoriteSubscription from '@/pages/subscription/FavoriteSubscription.vue'
import EditProfile from '@/pages/mypage/EditProfile.vue'
import Notice from '@/pages/mypage/Notice.vue'
import NoticeDetail from '@/pages/mypage/NoticeDetail.vue'
import Terms from '@/pages/mypage/Terms.vue'
import UserTerms from '@/pages/mypage/UserTerms.vue'
import Privacy from '@/pages/mypage/PrivacyPage.vue'
import Withdraw from '@/pages/mypage/Withdraw.vue'
import Calendar from '@/pages/calendar/Calendar.vue'
import Map from '@/pages/map/Map.vue'

import Login from '@/pages/auth/Login.vue'
import SignUp from '@/pages/auth/SignUp.vue'
import FindPassword from '@/pages/auth/FindPassword.vue'
import VerifyCode from '@/pages/auth/VerifyCode.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'
import BankAuth from '@/pages/account/BankAuth.vue'
import BankLoading from '@/pages/account/BankLoading.vue'
import BankSelect from '@/pages/account/BankSelect.vue'
import BankComplete from '@/pages/account/BankComplete.vue'
import NotFound from '@/pages/error/NotFound.vue'
import Mypage from '@/pages/mypage/Mypage.vue'

const routes = [
    // ✅ 모든 페이지를 평면 구조로 처리
    { path: '/', name: 'Home', component: Home }, // 홈 화면
    { path: '/calculator', name: 'Calculator', component: Calculator }, // 가점 계산기
    { path: '/preference', name: 'Preference', component: Preference }, // 선호지역
    { path: '/notification', name: 'Notification', component: Notification }, // 알림 페이지
    { path: '/notification/:id', name: 'NotificationDetail', component: NotoficationDetail }, // 알림 상세 페이지
    { path: '/subscriptions', name: 'SubscriptionList', component: SubscriptionList }, // 청약 정보 리스트 페이지
    { path: '/subscriptions/:id', name: 'SubscriptionDetail', component: SubscriptionDetail }, // 청약 정보 상세 페이지
    { path: '/favorites', name: 'FavoriteSubscription', component: FavoriteSubscription }, // 즐겨찾기
    { path: '/calendar', name: 'Calendar', component: Calendar }, // 달력 페이지
    { path: '/map', name: 'Map', component: Map }, // 지도 페이지
    { path: '/chatbot', name: 'Chatbot', component: Chatbot }, // 챗봇

    { path: '/mypage', name: 'Mypage', component: Mypage }, //마이페이지
    { path: '/mypage/edit', name: 'EditProfile', component: EditProfile }, // 프로필 편집
    { path: '/mypage/notice', name: 'Notice', component: Notice }, // FAQ(공지사항) 페이지
    { path: '/mypage/notice/:id', name: 'NoticeDetail', component: NoticeDetail }, // FAQ 상세 페이지
    { path: '/mypage/terms', name: 'Terms', component: Terms }, // 약관 페이지
    { path: '/mypage/withdraw', name: 'Withdraw', component: Withdraw }, // 회원탈퇴 페이지
    { path: '/terms', name: 'Terms', component: Terms }, // 약관 페이지
    { path: '/userterms', name: 'UserTerms', component: UserTerms }, // 사용자 약관 페이지
    { path: '/privacy', name: 'Privacy', component: Privacy }, // 개인정보 처리방침 페이지

    { path: '/login', name: 'Login', component: Login }, // 로그인 페이지
    { path: '/signup', name: 'SignUp', component: SignUp }, // 회원가입 페이지

    { path: '/find-password', name: 'FindPassword', component: FindPassword }, // 패스워드 찾기 페이지
    { path: '/find-password/verify', name: 'VerifyCode', component: VerifyCode }, // 패스워드 인증코드 페이지
    { path: '/find/reset-password', name: 'ResetPassword', component: ResetPassword }, // 패스워드 초기화 페이지

    { path: '/bank/auth', name: 'BankAuth', component: BankAuth }, // 은행 인증 페이지
    { path: '/bank/select', name: 'BankSelect', component: BankSelect }, // 은행 선택 페이지
    { path: '/bank/loading', name: 'BankLoading', component: BankLoading }, // 은행 로딩 페이지
    { path: '/bank/complete', name: 'BankComplete', component: BankComplete }, // 은행 연동 완료 페이지

    // 404
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // 에러 페이지
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
