// 현재 년월일에서 일을 +- 일 한 결과 리턴.
Date.prototype.addDays = function (days) {
    let date = this
    return new Date(date.setDate(date.getDate() + days))
}

// 현재 년월일에서 월을 +- 월 한 결과 리턴.
Date.prototype.addMonth = function (month) {
    let date = this
    return new Date(date.setMonth(date.getMonth() + month))
}

// 현재 년월일에서 년을 +- 월 한 결과 리턴.
Date.prototype.addYear = function (year) {
    let date = this
    return new Date(date.setFullYear(date.getFullYear() + year))
}

// 날짜 차이값 리턴 (일)
Date.prototype.diffDate = function (date1, date2) {
    const diff = date1.getTime() - date2.getTime()
    return Math.round(diff / (24 * 60 * 60 * 1000))
}

// 시간 차이값 리턴 (분)
Date.prototype.diffTime = function (date1, date2) {
    const diff = date1.getTime() - date2.getTime()
    return Math.round(diff / (60 * 1000))
}

// 현재 날짜가 특정 일자 사이에 있는지 확인
Date.prototype.betweenDate = function (start, end, date) {
    let startDate = new Date(start)
    let endDate = new Date(end)
    let dateDate = new Date(date)

    if (startDate <= dateDate && dateDate <= endDate) return true
    else return false
}

// 데이트 포맷
Date.prototype.dateStringFormat = function (date, format = '-') {
    let dateDate = new Date(date)

    return (
        dateDate.getFullYear().toString() +
        format +
        (dateDate.getMonth() + 1).toString().padStart(2, '0') +
        format +
        dateDate.getDate().toString().padStart(2, '0')
    )
}

// 시간 포맷
Date.prototype.dateTimeStringFormat = function (date, format = ':') {
    let dateDate = new Date(date)

    return (
        dateDate.getHours().toString() +
        format +
        dateDate.getMinutes().toString().padStart(2, '0') +
        format +
        dateDate.getSeconds().toString().padStart(2, '0')
    )
}

// 데이트 포맷 (년월일)
Date.prototype.dateStringKoFormat = function (date) {
    let dateDate = new Date(date)

    return (
        dateDate.getFullYear().toString() +
        '년 ' +
        (dateDate.getMonth() + 1).toString().padStart(2, '0') +
        '월 ' +
        dateDate.getDate().toString().padStart(2, '0') +
        '일'
    )
}
