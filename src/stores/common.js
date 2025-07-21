// 공용 저장용 pinia
// 공통으로 써야하는 데이터를 저장하는 부분

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
    const modal = ref(false) // 메뉴 버튼 눌렀을 때 우측 모달 창을 여는 플래그
    // 모달 창 열기
    const modalOpen = () => {
        modal.value = true
    }
    // 모달 창 닫기
    const modalClose = () => {
        modal.value = false
    }

    return { modal, modalOpen, modalClose }
})
