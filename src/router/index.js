import { createRouter, createWebHistory } from 'vue-router'
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
})

export default router
