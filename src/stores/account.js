// stores/account.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const selectedBankName = ref('')
  const selectedBankCode = ref('')

  function setSelectedBank(name, code) {
    selectedBankName.value = name
    selectedBankCode.value = code
  }

  return {
    selectedBankName,
    selectedBankCode,
    setSelectedBank
  }
})
