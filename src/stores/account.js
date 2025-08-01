// src/stores/account.js
import { defineStore } from 'pinia'
import accountApi from '@/api/accountApi'

export const useAccountStore = defineStore('account', {
    state: () => ({
        // --- 은행 선택용 ---
        selectedBankName: '',
        selectedBankCode: '',
        selectedBankLogo: '',
        // --- API 응답 계좌 정보 ---
        accountDisplay: '',
        accountBalance: 0,
        accountStartDate: '',
        resAccount: '',
        resAccountName: '',
        resFinalRoundNo: '',
        resAccountTrDate: '',
        isPayment: false,
    }),
    getters: {
        // 계좌가 이미 연결되어 있는지 여부
        isRegistered: (state) => !!state.resAccount,
    },
    actions: {
        /** 은행 선택 */
        setSelectedBank(name, code, logo) {
            this.selectedBankName = name
            this.selectedBankCode = code
            this.selectedBankLogo = logo
        },

        /** 스토어 초기화 */
        reset() {
            this.selectedBankName = ''
            this.selectedBankCode = ''
            this.selectedBankLogo = ''
            this.accountDisplay = ''
            this.accountBalance = 0
            this.accountStartDate = ''
            this.resAccount = ''
            this.resAccountName = ''
            this.resFinalRoundNo = ''
            this.resAccountTrDate = ''
            this.isPayment = false
        },

        /**
         * 1) POST /account/connect
         *    → 계좌 연결 요청
         */
        async connectAccount({ id, organization, bank_name, password }) {
            await accountApi.connect({ id, organization, bank_name, password })
            // 연결 성공 후 즉시 정보 조회
            await this.fetchAccount()
        },

        /**
         * 2) GET /account
         *    → 연결된 계좌 정보 가져오기
         */
        async fetchAccount() {
            const res = await accountApi.fetch()
            const d = res.data
            this.accountDisplay = d.account_display
            this.accountBalance = d.account_balance
            this.accountStartDate = d.account_start_date
            this.resAccount = d.res_account
            this.resAccountName = d.res_account_name
            this.resFinalRoundNo = d.res_final_round_no
            this.resAccountTrDate = d.res_account_tr_date
            this.isPayment = d.is_payment
        },
        /** 계좌 해지 요청 */
        async disconnectAccount() {
            try {
                await accountApi.disconnect()
                this.reset() // 상태 초기화
            } catch (error) {
                console.error('계좌 해지 실패:', error)
                throw error
            }
        },
    },
})
