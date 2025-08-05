// src/stores/scoreStore.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import scoreApi from '@/api/scoreApi'
import { useUserStore } from '@/stores/user'

export const useScoreStore = defineStore('score', () => {
    // ── 입력값 state ─────────────────────────────────
    const headOfHousehold = ref(JSON.parse(localStorage.getItem('headOfHousehold') ?? 'null')) // 1|0|null
    const houseOwner = ref(JSON.parse(localStorage.getItem('houseOwner') ?? 'null')) // 1|0|null
    const houseDisposal = ref(JSON.parse(localStorage.getItem('houseDisposal') ?? 'null')) // 1|0|null
    const disposalDate = ref(localStorage.getItem('disposalDate') ?? 'null') // 'YYYY-MM' or 'null'
    const maritalStatus = ref(JSON.parse(localStorage.getItem('maritalStatus') ?? 'null')) // 1|0|null
    const weddingDate = ref(localStorage.getItem('weddingDate') ?? 'null') // 'YYYY-MM' or 'null'
    const dependentsNm = ref(JSON.parse(localStorage.getItem('dependentsNm') ?? '0')) // number
    const residenceStartDate = ref(localStorage.getItem('residenceStartDate') ?? '') // 'YYYY-MM'
    const noHousePeriod = ref(JSON.parse(localStorage.getItem('noHousePeriod') ?? '0')) // number

    // ── 유저 정보 (생년월일) ─────────────────────────────
    const userStore = useUserStore()

    // ── 계산 결과 state ─────────────────────────────────
    const isCalculated = ref(false)
    const result = ref({
        head_of_household: 0,
        house_owner: 0,
        house_disposal: 0,
        disposal_date: null,
        marital_status: 0,
        wedding_date: null,
        dependents_nm: 0,
        no_house_period: 0,
        residence_start_date: '',
        payment_period: 0,
        dependents_score: 0,
        no_house_score: 0,
        payment_period_score: 0,
        total_ga_score: 0,
    })

    /** 백엔드에 계산 요청 */
    async function calculateScore() {
        if (
            [headOfHousehold, houseOwner, houseDisposal, maritalStatus].some(
                (x) => x.value === null,
            )
        ) {
            console.warn('[scoreStore] calculateScore skipped: missing inputs')
            return
        }

        const payload = {
            birth_date: userStore.birthDate,
            dependents_nm: dependentsNm.value,
            disposal_date: houseDisposal.value === 1 ? disposalDate.value : null,
            head_of_household: headOfHousehold.value,
            house_disposal: houseDisposal.value,
            house_owner: houseOwner.value,
            marital_status: maritalStatus.value,
            wedding_date: maritalStatus.value === 1 ? weddingDate.value : null,
            residence_start_date: residenceStartDate.value,
        }

        const res = await scoreApi.calculateScore(payload)

        // 상태 업데이트
        result.value = {
            head_of_household: res.data.head_of_household,
            house_owner: res.data.house_owner,
            house_disposal: res.data.house_disposal,
            disposal_date: res.data.disposal_date,
            marital_status: res.data.marital_status,
            wedding_date: res.data.wedding_date,
            dependents_nm: res.data.dependents_nm,
            no_house_period: res.data.no_house_period,
            residence_start_date: res.data.residence_start_date,
            payment_period: res.data.payment_period,
            dependents_score: res.data.dependents_score,
            no_house_score: res.data.no_house_score,
            payment_period_score: res.data.payment_period_score,
            total_ga_score: res.data.total_ga_score,
            noHousePeriod: res.data.no_house_period,
        }

        // 로컬에 무주택 기간 저장

        isCalculated.value = true
        return res.data
    }
    // ── 입력값 로컬저장 ─────────────────────────────────
    watch(headOfHousehold, (v) => localStorage.setItem('headOfHousehold', JSON.stringify(v)))
    watch(houseOwner, (v) => localStorage.setItem('houseOwner', JSON.stringify(v)))
    watch(houseDisposal, (v) => localStorage.setItem('houseDisposal', JSON.stringify(v)))
    watch(disposalDate, (v) => localStorage.setItem('disposalDate', v))
    watch(maritalStatus, (v) => localStorage.setItem('maritalStatus', JSON.stringify(v)))
    watch(weddingDate, (v) => localStorage.setItem('weddingDate', v))
    watch(dependentsNm, (v) => localStorage.setItem('dependentsNm', JSON.stringify(v)))
    watch(residenceStartDate, (v) => {
        localStorage.setItem('residenceStartDate', v)
    })
    watch(noHousePeriod, (v) => localStorage.setItem('noHousePeriod', JSON.stringify(v)))
    // ── 주택 처분일이 바뀌면 무주택 기간 재계산 & 즉시 calculateScore 호출
    watch([houseDisposal, disposalDate], ([newDisp, newDate]) => {
        console.log('[watch] houseDisposal=', newDisp, 'disposalDate=', newDate)
        if (newDisp === 1 && /^\d{4}-\d{2}$/.test(newDate)) {
            const [yStr, mStr] = newDate.split('-')
            const y = parseInt(yStr, 10)
            const m = parseInt(mStr, 10)
            const now = new Date()
            let years = now.getFullYear() - y
            if (now.getMonth() + 1 < m) years--

            noHousePeriod.value = years
            console.log(`[scoreStore] ▶ recomputed noHousePeriod=${years}`)

            // 입력값만 바뀐 경우에도 강제 재계산
            calculateScore().catch((err) => console.error('[scoreStore] recalc error:', err))
        }
    })
    // ── 스토어 생성 직후 자동 계산 ─────────────────────────────
    if (
        headOfHousehold.value !== null &&
        houseOwner.value !== null &&
        houseDisposal.value !== null &&
        maritalStatus.value !== null
    ) {
        calculateScore().catch(() => {})
    }

    return {
        headOfHousehold,
        houseOwner,
        houseDisposal,
        disposalDate,
        maritalStatus,
        weddingDate,
        dependentsNm,
        residenceStartDate,
        noHousePeriod,
        isCalculated,
        result,
        calculateScore,
    }
})
