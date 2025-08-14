
```
KB_FE
├─ PULL_REQUEST_TEMPLATE.md
├─ eslint.config.js
├─ postcss.config.cjs
├─ src
│  ├─ assets
│  │  ├─ tailwind.css
│  │  ├─ images
│  │  │  ├─ logo.png
│  │  │  ├─ zibi_0.png
│  │  │  ├─ zibi_1.png
│  │  │  ├─ zibi_2.png
│  │  │  ├─ zibi_3.png
│  │  │  ├─ zibi_4.png
│  │  │  ├─ zibi_5.png
│  │  │  ├─ kakao-icon.png
│  │  │  ├─ BNK.png
│  │  │  ├─ CITI.png
│  │  │  ├─ Hana.png
│  │  │  ├─ IBK.png
│  │  │  ├─ IM.png
│  │  │  ├─ KB.png
│  │  │  ├─ KJ.png
│  │  │  ├─ NH.png
│  │  │  ├─ SC.png
│  │  │  ├─ SH.png
│  │  │  ├─ Shinhan.png
│  │  │  ├─ Uri.png
│  │  │  ├─ surprise_zibi_0.png
│  │  │  ├─ surprise_zibi_1.png
│  │  │  ├─ surprise_zibi_2.png
│  │  │  ├─ surprise_zibi_3.png
│  │  │  ├─ surprise_zibi_4.png
│  │  │  └─ surprise_zibi_5.png
│  │  └─ main.css
│  ├─ components
│  │  ├─ common
│  │  │  ├─ SectionTItle.vue
│  │  │  ├─ Dropdown.vue
│  │  │  ├─ DatePickerQuestion.vue
│  │  │  ├─ FamilyCountInput.vue
│  │  │  ├─ MultiSelectCheckbox.vue
│  │  │  ├─ NumberInput.vue
│  │  │  ├─ QuestionCard.vue
│  │  │  ├─ YesNoQuestion.vue
│  │  │  ├─ InstallPrompt.vue
│  │  │  ├─ MainHeader.vue
│  │  │  ├─ BottomNavbar.vue
│  │  │  ├─ PrimaryButton.vue
│  │  │  └─ BackHeader.vue
│  │  ├─ subscription
│  │  │  └─ SubscriptionCard.vue
│  │  ├─ home
│  │  │  ├─ ScoreSection.vue
│  │  │  ├─ RecommendSection.vue
│  │  │  └─ AccountSection.vue
│  │  ├─ modal
│  │  │  ├─ PrivacyModal.vue
│  │  │  ├─ TermsModal.vue
│  │  │  ├─ ConfirmModal.vue
│  │  │  ├─ InfoModal.vue
│  │  │  ├─ DiagnosisCompleteModal.vue
│  │  │  ├─ AreaSettingModal.vue
│  │  │  ├─ CommonModal.vue
│  │  │  ├─ SubscriptionFilterModal.vue
│  │  │  └─ ModalBase.vue
│  │  ├─ SubDetail
│  │  │  ├─ RankSection.vue
│  │  │  └─ PossibilitySection.vue
│  │  └─ score
│  │     ├─ DependentCounter.vue
│  │     ├─ InfoTooltip.vue
│  │     └─ ScoreStepWrapper.vue
│  ├─ pages
│  │  ├─ account
│  │  │  ├─ BankComplete.vue
│  │  │  ├─ BankLoading.vue
│  │  │  ├─ BankSelect.vue
│  │  │  └─ BankAuth.vue
│  │  ├─ auth
│  │  │  ├─ FindPassword.vue
│  │  │  ├─ ResetPassword.vue
│  │  │  ├─ VerifyCode.vue
│  │  │  ├─ Login.vue
│  │  │  ├─ SignUp.vue
│  │  │  └─ KakaoCallbackPage.vue
│  │  ├─ chatbot
│  │  │  └─ Chatbot.vue
│  │  ├─ error
│  │  │  └─ NotFound.vue
│  │  ├─ home
│  │  │  └─ Home.vue
│  │  ├─ mypage
│  │  │  ├─ PrivacyPage.vue
│  │  │  ├─ Terms.vue
│  │  │  ├─ UserTerms.vue
│  │  │  ├─ MyPreference.vue
│  │  │  ├─ ChangePassword.vue
│  │  │  ├─ Mypage.vue
│  │  │  ├─ EditProfile.vue
│  │  │  ├─ Notice.vue
│  │  │  ├─ NoticeDetail.vue
│  │  │  └─ Withdraw.vue
│  │  ├─ notification
│  │  │  ├─ NotoficationDetail.vue
│  │  │  └─ Notification.vue
│  │  ├─ subscription
│  │  │  ├─ FavoriteSubscription.vue
│  │  │  ├─ RecentlyViewedSubscription.vue
│  │  │  ├─ SubscriptionList.vue
│  │  │  ├─ EtcSubscriptionDetail.vue
│  │  │  └─ SubscriptionDetail.vue
│  │  ├─ calendar
│  │  │  └─ Calendar.vue
│  │  ├─ map
│  │  │  └─ Map.vue
│  │  ├─ preference
│  │  │  └─ Preference.vue
│  │  └─ scores
│  │     ├─ EditStep4.vue
│  │     ├─ EditStep6_ResidenceInfo.vue
│  │     ├─ Step6_ResidenceInfo.vue
│  │     ├─ ScoreInfo.vue
│  │     ├─ ScoreResult.vue
│  │     ├─ Step1_HouseOwnership.vue
│  │     ├─ Step3_HouseholdHead.vue
│  │     ├─ Step4.vue
│  │     ├─ Step2_DisposalHistory.vue
│  │     ├─ EditStep1_HouseOwnership.vue
│  │     ├─ EditStep2_DisposalHistory.vue
│  │     ├─ EditStep3_HouseholdHead.vue
│  │     ├─ EditStep5_DependentFamily.vue
│  │     └─ Step5_DependentFamily.vue
│  ├─ router
│  │  └─ index.js
│  ├─ stores
│  │  ├─ common.js
│  │  ├─ preference.js
│  │  ├─ favorites.js
│  │  ├─ account.js
│  │  ├─ subscription.js
│  │  ├─ user.js
│  │  ├─ rank.js
│  │  ├─ scoreStore.js
│  │  ├─ firebaseStore.js
│  │  ├─ notificationStore.js
│  │  └─ chatStore.js
│  ├─ utils
│  │  ├─ date.js
│  │  └─ KakaoMapLoader.js
│  ├─ data
│  │  ├─ subscription-data.js
│  │  ├─ subscription-large-data.js
│  │  └─ area.js
│  ├─ api
│  │  ├─ emailApi.js
│  │  ├─ apiApi.js
│  │  ├─ mapApi.js
│  │  ├─ meApi.js
│  │  ├─ preferencesApi.js
│  │  ├─ calendarApi.js
│  │  ├─ accountApi.js
│  │  ├─ favoriteApi.js
│  │  ├─ scoreApi.js
│  │  ├─ axios.js
│  │  ├─ recentApi.js
│  │  ├─ rankApi.js
│  │  ├─ authApi.js
│  │  ├─ possibilityApi.js
│  │  ├─ chatApi.js
│  │  └─ notificationApi.js
│  ├─ App.vue
│  ├─ firebase.js
│  └─ main.js
├─ jsconfig.json
├─ postcss.config.js
├─ tailwind.config.js
├─ .prettierrc.json
├─ index.html
├─ public
│  ├─ logo_with_background.png
│  ├─ pwa-192x192.png
│  ├─ pwa-512x512.png
│  └─ firebase-messaging-sw.js
├─ README.md
├─ .hintrc
├─ package-lock.json
├─ package.json
└─ vite.config.js

```