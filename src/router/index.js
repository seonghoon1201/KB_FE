import { createRouter, createWebHistory } from 'vue-router'

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
})

export default router
