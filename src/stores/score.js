// 가점 스토어
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', {
  state: () => ({
    isCalculated: false,
    score: {
      total: 0,
      percent: 0,
      message: '',
    },
  }),
  actions: {
    setScore(total) {
      const percent = (total / 84) * 100
      let message = ''

      if (total >= 70) {
        message = '당첨 가능성이 매우 높아요!'
      } else if (total >= 50) {
        message = '당첨 가능성이 높은 편이에요!'
      } else if (total >= 30) {
        message = '보통 수준의 가점이에요.'
      } else {
        message = '가점을 높이기 위해 준비가 필요해요.'
      }

      this.score = { total, percent, message }
      this.isCalculated = true
    },
    resetScore() {
      this.score = {
        total: 0,
        percent: 0,
        message: '',
      }
      this.isCalculated = false
    },
  },
})
