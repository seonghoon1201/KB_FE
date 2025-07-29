// 📄 src/stores/scoreStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateAllScores } from '@/utils/scoreCalculator'

export const useScoreStore = defineStore('score', () => {
    // …기존 state…
    const houseOwned = ref(null)
    const houseDisposed = ref(null)
    const isHouseholdHead = ref(null)
    const isMarried = ref(null)
    const dependents = ref({ spouse: 0, parents: 0, children: 0 })
    const residence = ref({ city: '', district: '', startDate: '' })
    const accountStartDate = ref('')
    const depositCount = ref(0)

    // **새로 추가**: 홈에 표시할 저장된 결과
    const isCalculated = ref(false)
    const lastScore = ref({ total: 0, percent: 0, message: '' })

    // totalScore 계산 (임시, 기존 로직)
    const totalScore = computed(() => {
        // …noHouse + family + account 로직…
        return 0
    })

    // **새로 추가**: 현재 입력된 스토어 state 로 계산 후 lastScore 에 저장
    function saveResult() {
        const { total, evaluation } = calculateAllScores({
            noHouseInfo: {
                ownHouse: houseOwned.value === 'yes',
                familyOwnHouse: false, // 가족 소유 정보가 있으면 바꿔주세요
                birthDate: undefined, // 실제 birthDate 는 userStore 에서 가져오므로 여기는 빈값
                isMarried: isMarried.value === 'yes',
                marriageDate: null,
            },
            familyInfo: {
                hasSpouse: dependents.value.spouse > 0,
                familyCounts: {
                    ascendant: dependents.value.parents,
                    descendant: dependents.value.children,
                },
            },
            accountInfo: {
                hasAccount: !!accountStartDate.value,
                accountStartDate: accountStartDate.value,
                depositCount: depositCount.value,
            },
        })
        lastScore.value = {
            total,
            percent: (total / 84) * 100,
            message: evaluation,
        }
        isCalculated.value = true
    }

    return {
        houseOwned,
        houseDisposed,
        isHouseholdHead,
        isMarried,
        dependents,
        residence,
        accountStartDate,
        depositCount,
        isCalculated,
        lastScore,
        totalScore,
        saveResult,
    }
})
