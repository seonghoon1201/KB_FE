import { defineStore } from 'pinia'
import { calculateAllScores } from '@/utils/scoreCalculator'

export const useScoreStore = defineStore('score', {
  state: () => ({
    noHouseInfo: {},
    familyInfo: {},
    accountInfo: {},
    noHouse: 0,
    family: 0,
    account: 0,
    total: 0,
    evaluation: '',
  }),
  actions: {
    setNoHouseInfo(info) {
      this.noHouseInfo = info
    },
    setFamilyInfo(info) {
      this.familyInfo = info
    },
    setAccountInfo(info) {
      this.accountInfo = info
    },
    setScores({ noHouse, family, account, total, evaluation }) {
      this.noHouse = noHouse
      this.family = family
      this.account = account
      this.total = total
      this.evaluation = evaluation
    },
    calculateAll() {
      const result = calculateAllScores(this.$state)
      this.setScores(result)
    }
  }
})