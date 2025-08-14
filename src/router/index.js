// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ────────────────────────────
// ✅ 페이지 정적 임포트 (상단 로딩)
// ────────────────────────────

// auth
import Login from '@/pages/auth/Login.vue'
import KakaoCallbackPage from '@/pages/auth/KakaoCallbackPage.vue'
import SignUp from '@/pages/auth/SignUp.vue'
import FindPassword from '@/pages/auth/FindPassword.vue'
import VerifyCode from '@/pages/auth/VerifyCode.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'

// home / chatbot
import Home from '@/pages/home/Home.vue'
import Chatbot from '@/pages/chatbot/Chatbot.vue'

// preference
import Preference from '@/pages/preference/Preference.vue'

// notification
import Notification from '@/pages/notification/Notification.vue'
import NotificationDetail from '@/pages/notification/NotoficationDetail.vue' // (원문 파일명 유지)

// subscription
import SubscriptionList from '@/pages/subscription/SubscriptionList.vue'
import SubscriptionDetail from '@/pages/subscription/SubscriptionDetail.vue'
import EtcSubscriptionDetail from '@/pages/subscription/EtcSubscriptionDetail.vue'
import FavoriteSubscription from '@/pages/subscription/FavoriteSubscription.vue'
import RecentlyViewedSubscription from '@/pages/subscription/RecentlyViewedSubscription.vue'

// calendar / map
import Calendar from '@/pages/calendar/Calendar.vue'
import Map from '@/pages/map/Map.vue'

// bank
import BankAuth from '@/pages/account/BankAuth.vue'
import BankSelect from '@/pages/account/BankSelect.vue'
import BankLoading from '@/pages/account/BankLoading.vue'
import BankComplete from '@/pages/account/BankComplete.vue'

// mypage
import Mypage from '@/pages/mypage/Mypage.vue'
import EditProfile from '@/pages/mypage/EditProfile.vue'
import Notice from '@/pages/mypage/Notice.vue'
import Terms from '@/pages/mypage/Terms.vue'
import UserTerms from '@/pages/mypage/UserTerms.vue'
import Privacy from '@/pages/mypage/PrivacyPage.vue'
import Withdraw from '@/pages/mypage/Withdraw.vue'
import ChangePassword from '@/pages/mypage/ChangePassword.vue'
import MyPreference from '@/pages/mypage/MyPreference.vue'

// score (steps, result, info)
import ScoreStep1 from '@/pages/scores/Step1_HouseOwnership.vue'
import ScoreStep2 from '@/pages/scores/Step2_DisposalHistory.vue'
import ScoreStep3 from '@/pages/scores/Step3_HouseholdHead.vue'
import ScoreStep4 from '@/pages/scores/Step4.vue'
import ScoreStep5 from '@/pages/scores/Step5_DependentFamily.vue'
import ScoreStep6 from '@/pages/scores/Step6_ResidenceInfo.vue'
import ScoreResult from '@/pages/scores/ScoreResult.vue'
import ScoreInfo from '@/pages/scores/ScoreInfo.vue'

// score (edit)
import EditStep1 from '@/pages/scores/EditStep1_HouseOwnership.vue'
import EditStep2 from '@/pages/scores/EditStep2_DisposalHistory.vue'
import EditStep3 from '@/pages/scores/EditStep3_HouseholdHead.vue'
import EditStep4 from '@/pages/scores/EditStep4.vue'
import EditStep5 from '@/pages/scores/EditStep5_DependentFamily.vue'
import EditStep6 from '@/pages/scores/EditStep6_ResidenceInfo.vue'

// error
import NotFound from '@/pages/error/NotFound.vue'

const routes = [
    { path: '/', name: 'First', component: Login },
    // 홈 화면
    { path: '/home', name: 'Home', component: Home },
    // 챗봇 페이지
    { path: '/chatbot', name: 'Chabot', component: Chatbot },
    // 선호 설정 화면
    { path: '/preference', name: 'Preference', component: Preference },
    // 공지사항 화면
    { path: '/notification', name: 'Notification', component: Notification },
    // 공지사항 디테일 화면
    {
        path: '/notification/:id',
        name: 'NotificationDetail',
        component: NotificationDetail,
    },
    // 청약 정보 리스트 화면
    {
        path: '/subscriptions',
        name: 'SubscriptionList',
        component: SubscriptionList,
    },
    // 아파트 청약 정보 디테일 화면
    {
        path: '/subscriptions/:id',
        name: 'SubscriptionDetail',
        component: SubscriptionDetail,
    },
    // 아파트 제외 청약 정보 디테일 화면
    {
        path: '/etcsubscriptions/:id',
        name: 'EtcSubscriptionDetail',
        component: EtcSubscriptionDetail,
    },
    // 즐겨찾기 화면
    {
        path: '/favorites',
        name: 'FavoriteSubscription',
        component: FavoriteSubscription,
    },
    // 최근 본 공고 화면
    {
        path: '/recent',
        name: 'RecentlyViewedSubscription',
        component: RecentlyViewedSubscription,
    },
    // 달력 화면
    { path: '/calendar', name: 'Calendar', component: Calendar },
    // 지도 화면
    { path: '/map', name: 'Map', component: Map },
    // 챗봇 화면(아직 구현 X)
    { path: '/chatbot', name: 'Chatbot', component: Chatbot },

    // 로그인 & 회원가입 파트
    // 로그인 화면
    { path: '/login', name: 'Login', component: Login },
    // 카카오 콜백
    { path: '/kakao/callback', name: 'KakaoLogin', component: KakaoCallbackPage },
    // 회원가입 화면
    { path: '/signup', name: 'SignUp', component: SignUp },
    // 비밀번호 찾기 화면
    { path: '/find-password', name: 'FindPassword', component: FindPassword },
    // 인증코드 확인 화면
    { path: '/find-password/verify', name: 'VerifyCode', component: VerifyCode },
    // 비밀번호 재설정 화면
    { path: '/find/reset-password', name: 'ResetPassword', component: ResetPassword },

    // 은행 연결 관련 파트
    // 은행 로그인 화면
    { path: '/bank/auth', name: 'BankAuth', component: BankAuth },
    // 은행 선택 화면
    { path: '/bank/select', name: 'BankSelect', component: BankSelect },
    // 은행 로그인 로딩 화면
    { path: '/bank/loading', name: 'BankLoading', component: BankLoading },
    // 은행 로그인 완료 화면
    { path: '/bank/complete', name: 'BankComplete', component: BankComplete },

    // 마이페이지 파트
    // 마이페이지 화면
    { path: '/mypage', name: 'Mypage', component: Mypage },
    { path: '/mypage/edit', name: 'EditProfile', component: EditProfile },
    // FAQ 화면
    { path: '/mypage/notice', name: 'Notice', component: Notice },
    // // FAQ 상세 화면
    // {
    //     path: '/mypage/notice/:id',
    //     name: 'NoticeDetail',
    //     component: () => import('@/pages/mypage/NoticeDetail.vue'),
    // },
    // 이용약관 화면
    { path: '/mypage/terms', name: 'Terms', component: Terms },
    // 사용자 약관 화면
    { path: '/mypage/userterms', name: 'UserTerms', component: UserTerms },
    // 개인 정보 제공 동의 화면
    { path: '/mypage/privacy', name: 'Privacy', component: Privacy },
    // 마이페이지 수정 화면
    { path: '/mypage/withdraw', name: 'Withdraw', component: Withdraw },
    // 비밀번호 변경 화면
    { path: '/mypage/changepw', name: 'ChangePassword', component: ChangePassword },
    // 선호 설정 변경 화면
    { path: '/mypage/mypreferences', name: 'MyPreference', component: MyPreference },

    // 가점 정보 등록 파트
    // 가점 정보 1단계(무주택/주택)
    { path: '/score/step1', name: 'ScoreStep1', component: ScoreStep1 },
    // 가점 정보 2단계(분양권 처분 유무)
    { path: '/score/step2', name: 'ScoreStep2', component: ScoreStep2 },
    // 가점 정보 3단계(세대주 유무)
    { path: '/score/step3', name: 'ScoreStep3', component: ScoreStep3 },
    // 가점 정보 4단계(혼인 유무)
    { path: '/score/step4', name: 'ScoreStep4', component: ScoreStep4 },
    // 가점 정보 5단계(부양 가족 수)
    { path: '/score/step5', name: 'ScoreStep5', component: ScoreStep5 },
    // 가점 정보 6단계(거주지 설정)
    { path: '/score/step6', name: 'ScoreStep6', component: ScoreStep6 },
    // 가점 정보 결과 확인 페이지
    { path: '/score/result', name: 'ScoreResult', component: ScoreResult },
    // 가점 정보 세부 정보 페이지이자 수정 페이지
    { path: '/score/info', name: 'ScoreInfo', component: ScoreInfo },

    // **수정 전용 페이지** (edit routes)
    { path: '/score/edit/step1', name: 'EditStep1', component: EditStep1 },
    { path: '/score/edit/step2', name: 'EditStep2', component: EditStep2 },
    { path: '/score/edit/step3', name: 'EditStep3', component: EditStep3 },
    { path: '/score/edit/step4', name: 'EditStep4', component: EditStep4 },
    { path: '/score/edit/step5', name: 'EditStep5', component: EditStep5 },
    { path: '/score/edit/step6', name: 'EditStep6', component: EditStep6 },

    // 404 에러 페이지
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
