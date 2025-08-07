// src/api/rankApi.js
import api from './axios'

export default {
    /**
     * 아파트 청약 순위 조회
     * @param {string} pblancNo - 아파트 공고번호
     * @returns {Promise<Object>} - rankByArea 정보
     */
    getRankByArea(pblancNo) {
        return api.get('/subscriptions/apartments/detail/rank', {
            params: { pblanc_no: pblancNo },
        })
    },
}
