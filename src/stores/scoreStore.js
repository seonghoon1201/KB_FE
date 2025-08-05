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

    // ── 1. 서버에서 점수 계산된 결과 fetch ─────────────────
    async function fetchScore() {
        if (
            [headOfHousehold, houseOwner, houseDisposal, maritalStatus].some(
                (x) => x.value === null,
            )
        ) {
            console.warn('[scoreStore] fetchScore skipped: missing inputs')
            return null
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
        return res.data
    }

    // ── 2. 받아온 결과로 store 상태 반영 ─────────────────
    function setScore(data) {
        result.value = {
            head_of_household: data.head_of_household,
            house_owner: data.house_owner,
            house_disposal: data.house_disposal,
            disposal_date: data.disposal_date,
            marital_status: data.marital_status,
            wedding_date: data.wedding_date,
            dependents_nm: data.dependents_nm,
            no_house_period: data.no_house_period,
            residence_start_date: data.residence_start_date,
            payment_period: data.payment_period,
            dependents_score: data.dependents_score,
            no_house_score: data.no_house_score,
            payment_period_score: data.payment_period_score,
            total_ga_score: data.total_ga_score,
            noHousePeriod: data.no_house_period,
        }
        isCalculated.value = true
    }

    // ── 3. 통합: fetch + setScore 호출 ────────────────────
    async function calculateScore() {
        const data = await fetchScore()
        if (data) {
            setScore(data)
            return data
        }
        return null
    }

    // ── 입력값 로컬스토리지 저장 ──────────────────────────
    watch(headOfHousehold, (v) => localStorage.setItem('headOfHousehold', JSON.stringify(v)))
    watch(houseOwner, (v) => localStorage.setItem('houseOwner', JSON.stringify(v)))
    watch(houseDisposal, (v) => localStorage.setItem('houseDisposal', JSON.stringify(v)))
    watch(disposalDate, (v) => localStorage.setItem('disposalDate', v))
    watch(maritalStatus, (v) => localStorage.setItem('maritalStatus', JSON.stringify(v)))
    watch(weddingDate, (v) => localStorage.setItem('weddingDate', v))
    watch(dependentsNm, (v) => localStorage.setItem('dependentsNm', JSON.stringify(v)))
    watch(residenceStartDate, (v) => localStorage.setItem('residenceStartDate', v))
    watch(noHousePeriod, (v) => localStorage.setItem('noHousePeriod', JSON.stringify(v)))

    // ── 주택 처분일이 바뀌면 무주택 기간 계산 및 재계산 요청 ───
    watch([houseDisposal, disposalDate], ([newDisp, newDate]) => {
        if (newDisp === 1 && /^\d{4}-\d{2}$/.test(newDate)) {
            const [yStr, mStr] = newDate.split('-')
            const y = parseInt(yStr, 10)
            const m = parseInt(mStr, 10)
            const now = new Date()
            let years = now.getFullYear() - y
            if (now.getMonth() + 1 < m) years--

            noHousePeriod.value = years
            console.log(`[scoreStore] ▶ recomputed noHousePeriod=${years}`)

            // 즉시 재계산
            calculateScore().catch((err) => console.error('[scoreStore] recalc error:', err))
        }
    })

    // ── 스토어 생성 시 자동 계산 (입력값이 다 있을 경우) ───────
    if (
        headOfHousehold.value !== null &&
        houseOwner.value !== null &&
        houseDisposal.value !== null &&
        maritalStatus.value !== null
    ) {
        calculateScore().catch(() => {})
    }

    // ── 외부로 export ─────────────────────────────────────
    return {
        // 입력값
        headOfHousehold,
        houseOwner,
        houseDisposal,
        disposalDate,
        maritalStatus,
        weddingDate,
        dependentsNm,
        residenceStartDate,
        noHousePeriod,

        // 결과값
        isCalculated,
        result,

        // 메서드
        fetchScore,
        setScore,
        calculateScore,
    }
})
