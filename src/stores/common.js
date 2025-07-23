// 공용 저장용 pinia
// 공통으로 써야하는 데이터를 저장하는 부분

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
    const modal = ref(false) // 메뉴 버튼 눌렀을 때 우측 모달 창을 여는 플래그

    // 모달 닫기
    const modalClose = () => {
        modal.value = false
    }

    // 모달 열기/닫기
    const modalOnOff = () => {
        if (modal.value) {
            modal.value = false
        } else {
            modal.value = true
        }
    }

    return { modal, modalClose, modalOnOff }
})
