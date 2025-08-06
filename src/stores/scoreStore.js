// src/stores/scoreStore.js
import { defineStore } from 'pinia'
import scoreApi from '@/api/scoreApi'
import { useUserStore } from '@/stores/user'

export const useScoreStore = defineStore('score', {
    state: () => ({
        // ── 입력값 ──
        headOfHousehold: JSON.parse(localStorage.getItem('headOfHousehold') ?? 'null'),
        houseOwner: JSON.parse(localStorage.getItem('houseOwner') ?? 'null'),
        houseDisposal: JSON.parse(localStorage.getItem('houseDisposal') ?? 'null'),
        disposalDate: localStorage.getItem('disposalDate') ?? 'null',
        maritalStatus: JSON.parse(localStorage.getItem('maritalStatus') ?? 'null'),
        weddingDate: localStorage.getItem('weddingDate') ?? 'null',
        dependentsNm: JSON.parse(localStorage.getItem('dependentsNm') ?? '0'),
        residenceStartDate: localStorage.getItem('residenceStartDate') ?? '',
        noHousePeriod: JSON.parse(localStorage.getItem('noHousePeriod') ?? '0'),

        // ── 결과 및 상태 ──
        isCalculated: false,
        result: {
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
        },
    }),

    actions: {
        setInputsFromResult(data) {
            this.headOfHousehold = data.head_of_household
            this.houseOwner = data.house_owner
            this.houseDisposal = data.house_disposal
            this.disposalDate = data.disposal_date
            this.maritalStatus = data.marital_status
            this.weddingDate = data.wedding_date
            this.dependentsNm = data.dependents_nm
            this.residenceStartDate = data.residence_start_date
            this.noHousePeriod = data.no_house_period

            this.saveToLocal()
        },
        saveToLocal() {
            localStorage.setItem('headOfHousehold', JSON.stringify(this.headOfHousehold))
            localStorage.setItem('houseOwner', JSON.stringify(this.houseOwner))
            localStorage.setItem('houseDisposal', JSON.stringify(this.houseDisposal))
            localStorage.setItem('disposalDate', this.disposalDate)
            localStorage.setItem('maritalStatus', JSON.stringify(this.maritalStatus))
            localStorage.setItem('weddingDate', this.weddingDate)
            localStorage.setItem('dependentsNm', JSON.stringify(this.dependentsNm))
            localStorage.setItem('residenceStartDate', this.residenceStartDate)
            localStorage.setItem('noHousePeriod', JSON.stringify(this.noHousePeriod))
        },

        async calculateScore() {
            const userStore = useUserStore()

            if (
                this.headOfHousehold === null ||
                this.houseOwner === null ||
                this.houseDisposal === null ||
                this.maritalStatus === null
            ) {
                console.warn('[scoreStore] calculateScore skipped: missing inputs', {
                    headOfHousehold: this.headOfHousehold,
                    houseOwner: this.houseOwner,
                    houseDisposal: this.houseDisposal,
                    maritalStatus: this.maritalStatus,
                })
                return
            }

            const payload = {
                birth_date: userStore.birthDate,
                dependents_nm: this.dependentsNm,
                disposal_date: this.houseDisposal === 1 ? this.disposalDate : null,
                head_of_household: this.headOfHousehold,
                house_disposal: this.houseDisposal,
                house_owner: this.houseOwner,
                marital_status: this.maritalStatus,
                wedding_date: this.maritalStatus === 1 ? this.weddingDate : null,
                residence_start_date: this.residenceStartDate,
                no_house_period: this.noHousePeriod,
            }

            console.log('[📦 API 호출 전 payload]', payload)

            const res = await scoreApi.calculateScore(payload)

            console.log('[📥 API 응답 수신]', res.data)
            console.log('👉 dependents_score:', res.data.dependents_score)

            this.result = { ...res.data }
            this.noHousePeriod = res.data.no_house_period
            this.isCalculated = true
            this.saveToLocal()

            return res.data
        },

        setScore(data) {
            this.result = {
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
            }

            this.noHousePeriod = data.no_house_period
            this.isCalculated = true
        },

        recomputeNoHousePeriodIfNeeded() {
            let newPeriod = 0

            if (this.houseDisposal === 1 && /^\d{4}-\d{2}$/.test(this.disposalDate)) {
                const [yStr, mStr] = this.disposalDate.split('-')
                const y = parseInt(yStr, 10)
                const m = parseInt(mStr, 10)
                const now = new Date()
                let years = now.getFullYear() - y
                if (now.getMonth() + 1 < m) years--
                newPeriod = Math.max(0, years)
            } else if (this.houseDisposal === 0) {
                newPeriod = 10
            }

            this.noHousePeriod = newPeriod
            console.log(`[scoreStore] ▶ noHousePeriod 재계산: ${newPeriod}년`)
        },

        // ✅ 서버에서 점수 정보를 불러오는 액션 추가
        async fetchScoreFromServer() {
            try {
                const res = await scoreApi.getLastScore()
                const data = res.data

                this.setScore(data) // 점수 설정
                this.setInputsFromResult(data) // 입력값 일괄 설정

                console.log('[scoreStore] ✅ 서버에서 점수 및 입력값 불러오기 완료:', data)
                return data // ← ✔ 반환도 추가
            } catch (err) {
                console.error('[scoreStore] ❌ 서버 점수 정보 불러오기 실패:', err)
                throw err
            }
        },
    },
})
