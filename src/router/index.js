import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// 레이아웃 없이 보여줄 페이지 (로그인, 회원가입 등)
const noLayoutRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/Login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/pages/auth/SignUp.vue'),
  },
  {
    path: '/find-password',
    name: 'find-password',
    component: () => import('@/pages/auth/FindPassword.vue'),
  },
  {
    path: '/verify-code',
    name: 'verify-code',
    component: () => import('@/pages/auth/VerifyCode.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/pages/auth/ResetPassword.vue'),
  },
]

// 기본 레이아웃을 사용하는 모든 페이지
const layoutRoutes = {
  path: '/',
  component: DefaultLayout,
  children: [
    {
      path: '',
      name: 'home',
      component: () => import('@/pages/home/Home.vue'),
    },
    {
      path: 'notification',
      name: 'notification',
      component: () => import('@/pages/notification/Notification.vue'),
    },
    {
      path: 'subscription/list',
      name: 'subscription-list',
      component: () => import('@/pages/subscription/SubscriptionList.vue'),
    },
    {
      path: 'subscription/detail',
      name: 'subscription-detail',
      component: () => import('@/pages/subscription/SubscriptionDetail.vue'),
    },
    {
      path: 'subscription/favorite',
      name: 'subscription-favorite',
      component: () => import('@/pages/subscription/FavoriteSubscription.vue'),
    },
    {
      path: 'calculator',
      name: 'calculator',
      component: () => import('@/pages/calculator/Calculator.vue'),
    },
    {
      path: 'chatbot',
      name: 'chatbot',
      component: () => import('@/pages/chatbot/Chatbot.vue'),
    },
    {
      path: 'mypage/edit',
      name: 'edit-profile',
      component: () => import('@/pages/mypage/EditProfile.vue'),
    },
    {
      path: 'mypage/notice',
      name: 'notice',
      component: () => import('@/pages/mypage/Notice.vue'),
    },
    {
      path: 'mypage/terms',
      name: 'terms',
      component: () => import('@/pages/mypage/Terms.vue'),
    },
    {
      path: 'mypage/withdraw',
      name: 'withdraw',
      component: () => import('@/pages/mypage/Withdraw.vue'),
    },
    {
      path: 'account/select-bank',
      name: 'select-bank',
      component: () => import('@/pages/account/BankSelect.vue'),
    },
    {
      path: 'account/auth',
      name: 'bank-auth',
      component: () => import('@/pages/account/BankAuth.vue'),
    },
    {
      path: 'account/complete',
      name: 'bank-complete',
      component: () => import('@/pages/account/BankComplete.vue'),
    },
  ],
}

// 404 페이지
const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/pages/error/NotFound.vue'),
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...noLayoutRoutes, layoutRoutes, notFoundRoute],
=======

// ✅ 레이아웃
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// ✅ 레이아웃 적용되는 페이지
import Home from '@/pages/home/Home.vue'
import Calculator from '@/pages/calculator/Calculator.vue'
import Chatbot from '@/pages/chatbot/Chatbot.vue'
import Notification from '@/pages/notification/Notification.vue'
import SubscriptionList from '@/pages/subscription/SubscriptionList.vue'
import SubscriptionDetail from '@/pages/subscription/SubscriptionDetail.vue'
import FavoriteSubscription from '@/pages/subscription/FavoriteSubscription.vue'
import EditProfile from '@/pages/mypage/EditProfile.vue'
import Notice from '@/pages/mypage/Notice.vue'
import Terms from '@/pages/mypage/Terms.vue'
import Withdraw from '@/pages/mypage/Withdraw.vue'

// ❌ 레이아웃 없이 단독 렌더링될 페이지
import Login from '@/pages/auth/Login.vue'
import SignUp from '@/pages/auth/SignUp.vue'
import FindPassword from '@/pages/auth/FindPassword.vue'
import VerifyCode from '@/pages/auth/VerifyCode.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'
import BankAuth from '@/pages/account/BankAuth.vue'
import BankSelect from '@/pages/account/BankSelect.vue'
import BankComplete from '@/pages/account/BankComplete.vue'
import NotFound from '@/pages/error/NotFound.vue'

const routes = [
  // ✅ DefaultLayout이 적용되는 그룹
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'calculator', name: 'Calculator', component: Calculator },
      { path: 'chatbot', name: 'Chatbot', component: Chatbot },
      { path: 'notification', name: 'Notification', component: Notification },
      { path: 'subscriptions', name: 'SubscriptionList', component: SubscriptionList },
      { path: 'subscriptions/:id', name: 'SubscriptionDetail', component: SubscriptionDetail },
      { path: 'favorites', name: 'FavoriteSubscription', component: FavoriteSubscription },
      { path: 'mypage/edit', name: 'EditProfile', component: EditProfile },
      { path: 'mypage/notice', name: 'Notice', component: Notice },
      { path: 'mypage/terms', name: 'Terms', component: Terms },
      { path: 'mypage/withdraw', name: 'Withdraw', component: Withdraw },
    ]
  },

  // ❌ 레이아웃 없는 페이지
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/find-password', name: 'FindPassword', component: FindPassword },
  { path: '/verify-code', name: 'VerifyCode', component: VerifyCode },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/bank/auth', name: 'BankAuth', component: BankAuth },
  { path: '/bank/select', name: 'BankSelect', component: BankSelect },
  { path: '/bank/complete', name: 'BankComplete', component: BankComplete },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
>>>>>>> upstream/main
})

export default router
