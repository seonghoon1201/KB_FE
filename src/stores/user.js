// 📄 src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: '',
        email: '',
        phone: '',
        token: '',
        isLoggedIn: false,

        // 가점 계산 관련
        score: null,
        birthDate: '', // 'YYYY-MM-DD'
        isMarried: false,
        marriageDate: '', // 'YYYY-MM-DD'
    }),
    actions: {
        setUserInfo({ id, name, email, phone, token, birthDate, isMarried, marriageDate }) {
            this.id = id
            this.name = name
            this.email = email
            this.phone = phone
            this.token = token
            this.isLoggedIn = true

            this.birthDate = birthDate
            this.isMarried = isMarried
            this.marriageDate = marriageDate
        },
        logout() {
            this.id = null
            this.name = ''
            this.email = ''
            this.phone = ''
            this.token = ''
            this.isLoggedIn = false
            this.score = null

            this.birthDate = ''
            this.isMarried = false
            this.marriageDate = ''
        },
        saveScore(scoreObj) {
            this.score = scoreObj
        },
    },
})
