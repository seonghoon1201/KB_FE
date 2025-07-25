// 계좌 등록 스토어
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    selectedBankName: '',
    selectedBankCode: '',
    selectedBankLogo: '',
    accountNumber: '',
  }),
  actions: {
    setSelectedBank(name, code, logo) {
      this.selectedBankName = name
      this.selectedBankCode = code
      this.selectedBankLogo = logo
      this.accountNumber = '123-45-678901' // 더미 계좌번호 (추후 API로 대체)
    },
    reset() {
      this.selectedBankName = ''
      this.selectedBankCode = ''
      this.selectedBankLogo = ''
      this.accountNumber = ''
    }
  },
  getters: {
    isRegistered: (state) => !!state.selectedBankName
  }
})
