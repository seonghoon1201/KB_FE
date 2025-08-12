// src/api/possibilityApi.js
import api from './axios'

// 공고번호 정규화
function normalizePblancNo(pblancNo) {
    if (pblancNo == null) return ''
    return String(pblancNo).trim().replace(/\D/g, '')
}

// houseType: 'apt' | 'office'
async function postProbability(houseType, pblancNo) {
    const n = normalizePblancNo(pblancNo)
    if (!n) {
        const err = new Error('pblancNo is empty')
        err.code = 'INVALID_PBLANC_NO'
        throw err
    }

    const path =
        houseType === 'officetel' ? '/predict/probability/officetel' : '/predict/probability/apt'

    const payload = { pblanc_no: n }

    try {
        return await api.post(path, payload, {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (e) {
        console.error('[possibilityApi]', path, 'payload:', payload)
        console.error('[possibilityApi] error:', e.response?.status, e.response?.data || e.message)
        throw e
    }
}

export default {
    getProbability(pblancNo, houseType = 'apt') {
        const t = String(houseType).toLowerCase()
        const kind = t.includes('오피스텔') || t.includes('officetel') ? 'officetel' : 'apt'
        return postProbability(kind, pblancNo)
    },
    getAptProbability(pblancNo) {
        return postProbability('apt', pblancNo)
    },
    getOfficetelProbability(pblancNo) {
        return postProbability('officetel', pblancNo)
    },
}
