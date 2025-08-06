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
                console.warn('[scoreStore] calculateScore skipped: missing inputs')
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
                no_house_period: this.noHousePeriod, // ✅ 추가
            }

            const res = await scoreApi.calculateScore(payload)

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
                // 처분한 경우
                const [yStr, mStr] = this.disposalDate.split('-')
                const y = parseInt(yStr, 10)
                const m = parseInt(mStr, 10)
                const now = new Date()
                let years = now.getFullYear() - y
                if (now.getMonth() + 1 < m) years--
                newPeriod = Math.max(0, years)
            } else if (this.houseDisposal === 0) {
                // 현재 무주택 상태이므로 최대치로 설정 (예: 10년)
                newPeriod = 10
            }

            this.noHousePeriod = newPeriod
            console.log(`[scoreStore] ▶ noHousePeriod 재계산: ${newPeriod}년`)
        },
    },
})
