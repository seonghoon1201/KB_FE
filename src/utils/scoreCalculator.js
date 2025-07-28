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

function calculateNoHouseScore({ ownHouse, familyOwnHouse, age, isMarried, noHouseStartDate }) {
    if (ownHouse || familyOwnHouse) return 0
    if (!noHouseStartDate) return 0

    const start = new Date(noHouseStartDate)
    const now = new Date()
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365)
    return Math.min(Math.floor(years * 2), 32)
}

function calculateFamilyScore({ hasSpouse, familyCounts }) {
    let count = 0
    if (hasSpouse) count += 1
    count += parseInt(familyCounts.spouse || 0)
    count += parseInt(familyCounts.ascendant || 0)
    count += parseInt(familyCounts.descendant || 0)
    return Math.min(5 + count * 5, 35)
}

function calculateAccountScore({ hasAccount, accountStartDate, depositCount }) {
    if (!hasAccount || !accountStartDate || !depositCount) return 0
    return Math.min(Math.floor(depositCount / 6), 17)
}
