// 계좌 등록 관련 상태와 메서드를 관리하는 Pinia 스토어 정의
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
    // 상태 정의
    state: () => ({
        selectedBankName: '', // 선택된 은행 이름
        selectedBankCode: '', // 선택된 은행 코드
        selectedBankLogo: '', // 선택된 은행 로고 이미지 경로
        accountNumber: '', // 계좌번호 (현재는 더미 데이터)
    }),
    // 상태를 변경하는 메서드 정의
    actions: {
        /**
         * 사용자가 은행을 선택했을 때 상태를 갱신하는 메서드
         * @param name 은행 이름
         * @param code 은행 코드
         * @param logo 은행 로고 이미지 경로
         */
        setSelectedBank(name, code, logo) {
            this.selectedBankName = name
            this.selectedBankCode = code
            this.selectedBankLogo = logo
            this.accountNumber = '123-45-678901' // 더미 계좌번호 (추후 API로 대체)
        },
        // 계좌 관련 상태 초기화
        reset() {
            this.selectedBankName = ''
            this.selectedBankCode = ''
            this.selectedBankLogo = ''
            this.accountNumber = ''
        },
    },
    // 상태 기반 파생값을 계산하는 getter 정의
    getters: {
        // 계좌가 등록되어 있는지 여부를 boolean 값으로 반환
        isRegistered: (state) => !!state.selectedBankName,
    },
})
