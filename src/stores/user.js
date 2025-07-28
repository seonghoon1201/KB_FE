import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
    email: '',
    phone: '',
    isLoggedIn: false,
    token: '',
    score: null, // 가점 정보 저장
  }),
  actions: {
    setUserInfo({ id, name, email, phone, token }) {
      this.id = id
      this.name = name
      this.email = email
      this.phone = phone
      this.token = token
      this.isLoggedIn = true
    },
    logout() {
      this.id = null
      this.name = ''
      this.email = ''
      this.phone = ''
      this.token = ''
      this.isLoggedIn = false
      this.score = null
    },
    saveScore(scoreObj) {
      this.score = scoreObj
    },
  },
})
