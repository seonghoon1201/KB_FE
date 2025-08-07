// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'First', component: () => import('@/pages/auth/Login.vue') },
    // 홈 화면
    { path: '/home', name: 'Home', component: () => import('@/pages/home/Home.vue') },
    // 선호 설정 화면
    {
        path: '/preference',
        name: 'Preference',
        component: () => import('@/pages/preference/Preference.vue'),
    },
    // 공지사항 화면
    {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/pages/notification/Notification.vue'),
    },
    // 공지사항 디테일 화면
    {
        path: '/notification/:id',
        name: 'NotificationDetail',
        component: () => import('@/pages/notification/NotoficationDetail.vue'),
    },
    // 청약 정보 리스트 화면
    {
        path: '/subscriptions',
        name: 'SubscriptionList',
        component: () => import('@/pages/subscription/SubscriptionList.vue'),
    },
    // 아파트 청약 정보 디테일 화면
    {
        path: '/subscriptions/:id',
        name: 'SubscriptionDetail',
        component: () => import('@/pages/subscription/SubscriptionDetail.vue'),
    },
    // 아파트 제외 청약 정보 디테일 화면
    {
        path: '/etcsubscriptions/:id',
        name: 'EtcSubscriptionDetail',
        component: () => import('@/pages/subscription/EtcSubscriptionDetail.vue'),
    },
    // 즐겨찾기 화면
    {
        path: '/favorites',
        name: 'FavoriteSubscription',
        component: () => import('@/pages/subscription/FavoriteSubscription.vue'),
    },
    // 최근 본 공고 화면
    {
        path: '/recent',
        name: 'RecentlyViewedSubscription',
        component: () => import('@/pages/subscription/RecentlyViewedSubscription.vue'),
    },
    // 달력 화면
    {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/pages/calendar/Calendar.vue'),
    },
    // 지도 화면
    {
        path: '/map',
        name: 'Map',
        component: () => import('@/pages/map/Map.vue'),
    },
    // 챗봇 화면(아직 구현 X)
    {
        path: '/chatbot',
        name: 'Chatbot',
        component: () => import('@/pages/chatbot/Chatbot.vue'),
    },

    // 로그인 & 회원가입 파트
    // 로그인 화면
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/auth/Login.vue'),
    },
    // 회원가입 화면
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('@/pages/auth/SignUp.vue'),
    },
    // 비밀번호 찾기 화면
    {
        path: '/find-password',
        name: 'FindPassword',
        component: () => import('@/pages/auth/FindPassword.vue'),
    },
    // 인증코드 확인 화면
    {
        path: '/find-password/verify',
        name: 'VerifyCode',
        component: () => import('@/pages/auth/VerifyCode.vue'),
    },
    // 비밀번호 재설정 화면
    {
        path: '/find/reset-password',
        name: 'ResetPassword',
        component: () => import('@/pages/auth/ResetPassword.vue'),
    },

    // 은행 연결 관련 파트
    // 은행 로그인 화면
    {
        path: '/bank/auth',
        name: 'BankAuth',
        component: () => import('@/pages/account/BankAuth.vue'),
    },
    // 은행 선택 화면
    {
        path: '/bank/select',
        name: 'BankSelect',
        component: () => import('@/pages/account/BankSelect.vue'),
    },
    // 은행 로그인 로딩 화면
    {
        path: '/bank/loading',
        name: 'BankLoading',
        component: () => import('@/pages/account/BankLoading.vue'),
    },
    // 은행 로그인 완료 화면
    {
        path: '/bank/complete',
        name: 'BankComplete',
        component: () => import('@/pages/account/BankComplete.vue'),
    },

    // 마이페이지 파트
    // 마이페이지 화면
    { path: '/mypage', name: 'Mypage', component: () => import('@/pages/mypage/Mypage.vue') },
    {
        path: '/mypage/edit',
        name: 'EditProfile',
        component: () => import('@/pages/mypage/EditProfile.vue'),
    },
    // FAQ 화면
    {
        path: '/mypage/notice',
        name: 'Notice',
        component: () => import('@/pages/mypage/Notice.vue'),
    },
    // // FAQ 상세 화면
    // {
    //     path: '/mypage/notice/:id',
    //     name: 'NoticeDetail',
    //     component: () => import('@/pages/mypage/NoticeDetail.vue'),
    // },
    // 이용약관 화면
    {
        path: '/mypage/terms',
        name: 'Terms',
        component: () => import('@/pages/mypage/Terms.vue'),
    },
    // 사용자 약관 화면
    {
        path: '/mypage/userterms',
        name: 'UserTerms',
        component: () => import('@/pages/mypage/UserTerms.vue'),
    },
    // 개인 정보 제공 동의 화면
    {
        path: '/mypage/privacy',
        name: 'Privacy',
        component: () => import('@/pages/mypage/PrivacyPage.vue'),
    },
    // 마이페이지 수정 화면
    {
        path: '/mypage/withdraw',
        name: 'Withdraw',
        component: () => import('@/pages/mypage/Withdraw.vue'),
    },
    // 비밀번호 변경 화면
    {
        path: '/mypage/changepw',
        name: 'ChangePassword',
        component: () => import('@/pages/mypage/ChangePassword.vue'),
    },
    // 선호 설정 변경 화면
    {
        path: '/mypage/mypreferences',
        name: 'MyPreference',
        component: () => import('@/pages/mypage/MyPreference.vue'),
    },

    // 가점 정보 등록 파트
    // 가점 정보 1단계(무주택/주택)
    {
        path: '/score/step1',
        name: 'ScoreStep1',
        component: () => import('@/pages/scores/Step1_HouseOwnership.vue'),
    },
    // 가점 정보 2단계(분양권 처분 유무)
    {
        path: '/score/step2',
        name: 'ScoreStep2',
        component: () => import('@/pages/scores/Step2_DisposalHistory.vue'),
    },
    // 가점 정보 3단계(세대주 유무)
    {
        path: '/score/step3',
        name: 'ScoreStep3',
        component: () => import('@/pages/scores/Step3_HouseholdHead.vue'),
    },
    // 가점 정보 4단계(혼인 유무)
    {
        path: '/score/step4',
        name: 'ScoreStep4',
        component: () => import('@/pages/scores/Step4.vue'),
    },
    // 가점 정보 5단계(부양 가족 수)
    {
        path: '/score/step5',
        name: 'ScoreStep5',
        component: () => import('@/pages/scores/Step5_DependentFamily.vue'),
    },
    // 가점 정보 6단계(거주지 설정)
    {
        path: '/score/step6',
        name: 'ScoreStep6',
        component: () => import('@/pages/scores/Step6_ResidenceInfo.vue'),
    },
    // 가점 정보 결과 확인 페이지
    {
        path: '/score/result',
        name: 'ScoreResult',
        component: () => import('@/pages/scores/ScoreResult.vue'),
    },
    // 가점 정보 세부 정보 페이지이자 수정 페이지
    {
        path: '/score/info',
        name: 'ScoreInfo',
        component: () => import('@/pages/scores/ScoreInfo.vue'),
    },

    // **수정 전용 페이지** (edit routes)
    {
        path: '/score/edit/step1',
        name: 'EditStep1',
        component: () => import('@/pages/scores/EditStep1_HouseOwnership.vue'),
    },
    {
        path: '/score/edit/step2',
        name: 'EditStep2',
        component: () => import('@/pages/scores/EditStep2_DisposalHistory.vue'),
    },
    {
        path: '/score/edit/step3',
        name: 'EditStep3',
        component: () => import('@/pages/scores/EditStep3_HouseholdHead.vue'),
    },
    {
        path: '/score/edit/step4',
        name: 'EditStep4',
        component: () => import('@/pages/scores/EditStep4.vue'),
    },
    {
        path: '/score/edit/step5',
        name: 'EditStep5',
        component: () => import('@/pages/scores/EditStep5_DependentFamily.vue'),
    },
    {
        path: '/score/edit/step6',
        name: 'EditStep6',
        component: () => import('@/pages/scores/EditStep6_ResidenceInfo.vue'),
    },

    // 404 에러 페이지
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/error/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
