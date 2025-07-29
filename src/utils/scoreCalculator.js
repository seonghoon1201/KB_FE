// 📄 src/utils/scoreCalculator.js

export function calculateAllScores(state) {
    const noHouse = calculateNoHouseScore(state.noHouseInfo)
    const family = calculateFamilyScore(state.familyInfo)
    const account = calculateAccountScore(state.accountInfo)
    const total = noHouse + family + account

    let evaluation = ''
    if (total >= 70) evaluation = '당첨 가능성이 매우 높아요!'
    else if (total >= 50) evaluation = '당첨 가능성이 높은 편이에요!'
    else if (total >= 30) evaluation = '보통 수준의 가점이에요.'
    else evaluation = '가점을 높이기 위해 준비가 필요해요.'

    return { noHouse, family, account, total, evaluation }
}

export function calculateNoHouseScore({
    ownHouse,
    familyOwnHouse,
    birthDate,
    isMarried,
    marriageDate,
}) {
    if (ownHouse || familyOwnHouse) return 0
    if (!birthDate) return 0

    const age30Date = new Date(birthDate)
    age30Date.setFullYear(age30Date.getFullYear() + 30)

    let startDate = age30Date
    if (isMarried && marriageDate) {
        const marryDate = new Date(marriageDate)
        startDate = marryDate < age30Date ? marryDate : age30Date
    }

    const now = new Date()
    const years = (now - startDate) / (1000 * 60 * 60 * 24 * 365)
    // 연당 2점, 최대 32점
    return Math.min(Math.floor(years * 2), 32)
}

export function calculateFamilyScore({ hasSpouse, familyCounts }) {
    let count = 0
    if (hasSpouse) count += 1
    count += parseInt(familyCounts.ascendant || 0)
    count += parseInt(familyCounts.descendant || 0)
    // 기본 5점 + 1명당 5점, 최대 35점
    return Math.min(5 + count * 5, 35)
}

export function calculateAccountScore({ accountStartDate, depositCount }) {
    // 가입일 또는 횟수가 없으면 0점
    if (!accountStartDate || !depositCount) return 0

    // "납입 개월 수" 기준이라고 가정
    // 6개월 미만 → 1점
    if (depositCount < 6) return 1

    // 6개월 이상 then (납입개월수 / 12년) → 년수
    // 예: 8개월 → floor(8/12)=0 + 2 = 2점
    //     14개월 → floor(14/12)=1 + 2 = 3점
    //     96개월 → floor(96/12)=8 + 2 = 10점
    const years = Math.floor(depositCount / 12)
    const points = 2 + years * 2

    // 최대 17점
    return Math.min(points, 17)
}
