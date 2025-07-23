<template>
    <div class="flex flex-1 flex-col bg-white text-center px-4">
        <BackHeader title="달력 보기" />
        <main class="w-full px-1 py-6 space-y-6 pt-[70px]">
            <div class="flex-1 w-full overflow-hidden">
                <div class="flex items-center">
                    <div
                        class="relative w-full h-6 rounded flex justify-between items-center m-1"
                        v-if="currentView === 'dayGridMonth'"
                    >
                        <button
                            class="w-8 m-1 flex justify-center items-center border"
                            @click="monthMove('prev')"
                        >
                            <ChevronLeft />
                        </button>

                        <span
                            class="flex flex-col items-center px-4 py-2 font-medium rounded-lg shadow focus:outline-none focus:ring-2 transition"
                            @click="monthMove('today')"
                        >
                            <span class="text-sm text-center">{{ todayMonth }}</span>
                            <span class="text-lg font-semibold -mt-1">{{ todayDay }}</span>
                        </span>

                        <button
                            class="w-8 m-1 flex justify-center items-center border"
                            @click="monthMove('next')"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    <div
                        class="relative w-full h-6 rounded flex items-center m-1"
                        v-if="currentView === 'dayGridWeek'"
                    >
                        <span
                            @click="changeView('dayGridMonth')"
                            class="w-8 m-1 flex justify-center items-center border"
                        >
                            ←
                        </span>
                        <!-- 캘린더 제목 -->
                        <div
                            class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center pointer-events-none"
                        >
                            <h2 class="inline-block text-lg font-semibold px-2">
                                {{ headerTitle }}
                            </h2>
                        </div>
                    </div>
                </div>

                <FullCalendar
                    ref="calendarRef"
                    :options="calendarOptions"
                    class="fc-toolbar-title"
                />
            </div>
        </main>
        <BottomNavBar />
    </div>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import axios from 'axios' // ← 이 줄을 추가하세요
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavBar from '@/components/common/BottomNavbar.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarRef = ref(null) // 달력의 기능을 사용하는 ref
const selectedDate = ref('') // 선택된 날짜를 저장할 ref
const currentView = ref('dayGridMonth') // 달력의 뷰 설정
const headerTitle = ref('') // 달력의 제목 설정

// const calendarOptions = reactive({
//     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
//     initialView: currentView.value,
//     allDaySlot: false, // 주간뷰에서 all-day 슬롯(빈 행) 제거
//     weekends: false,
//     fixedWeekCount: false,
//     height: 500,

//     contentHeight: 400,
//     dayMaxEventRows: true, // 셀당 최대 표시 가능한 이벤트 개수를 '셀 높이' 기준으로 자름 :contentReference[oaicite:0]{index=0}
//     // fixedWeekCount: false, // 해당 월에 꼭 필요한 주만 표시 (5주 이하)

//     expandRows: true, // 빈 공간 없이 최대한 꽉 채움
//     headerToolbar: {
//         left: false,
//         center: false,
//         right: false,
//     }, // 헤더 툴바 숨김
//     slotLabelFormat: [
//         { hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' }, // top level of text
//         { weekday: 'short' }, // lower level of text
//     ], // 시간대 레이블 숨김
//     views: {
//         // 월간 뷰: 요일 이름만
//         dayGridMonth: {
//             // dayHeaderFormat: { weekday: 'short' }, // Mon, Tue, Wed...
//             // height: 500,
//             showNonCurrentDates: false,
//         },
//         // 주간 뷰: 날짜(숫자)만
//         dayGridWeek: {
//             dayHeaderFormat: { day: 'numeric' },
//             height: 100,
//             // showNonCurrentDates: false,
//             // fixedWeekCount: false,
//         },
//     },
//     events: [
//         {
//             id: '1', // (선택) 고유 ID
//             title: '회의', // 캘린더에 표시될 텍스트
//             start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
//             end: '2025-07-23T10:00:00', // (선택) 종료 시각
//             allDay: false, // 종일 여부 (true면 시간 무시)
//             color: '#3a87ad', // (선택) 이벤트 색상
//         },
//         {
//             id: '2', // (선택) 고유 ID
//             title: '회의', // 캘린더에 표시될 텍스트
//             start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
//             end: '2025-07-23T10:00:00', // (선택) 종료 시각
//             allDay: false, // 종일 여부 (true면 시간 무시)
//             color: '#3a87ad', // (선택) 이벤트 색상
//         },
//         {
//             id: '3', // (선택) 고유 ID
//             title: '회의', // 캘린더에 표시될 텍스트
//             start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
//             end: '2025-07-23T10:00:00', // (선택) 종료 시각
//             allDay: false, // 종일 여부 (true면 시간 무시)
//             color: '#3a87ad', // (선택) 이벤트 색상
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
//             end: '2025-08-12T16:00:00', // 2박 3일
//             allDay: true,
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
//             end: '2025-08-12T16:00:00', // 2박 3일
//             allDay: true,
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
//             end: '2025-08-12T16:00:00', // 2박 3일
//             allDay: true,
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//         {
//             id: '4',
//             title: '점심 약속',
//             start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
//             allDay: false, // 종일 여부 (true면 시간 무시)
//         },
//     ],
//     dateClick(info) {
//         const api = calendarRef.value.getApi()

//         console.log('클릭된 날짜:', info.dateStr) // 'YYYY-MM-DD' 형식 문자열
//         // info.date: JS Date 객체
//         // info.dayEl: 클릭된 셀 DOM 요소
//         // info.jsEvent: 원본 마우스 이벤트
//         selectedDate.value = info.dateStr
//         changeView('dayGridWeek', info.date)
//         currentView.value = 'dayGridWeek'

//         api.getEvents()
//             .filter((e) => e.display === 'background')
//             .forEach((e) => e.remove())

//         api.addEvent({
//             start: info.dateStr,
//             allDay: true,
//             display: 'background',
//             color: '#FFE0B2',
//         })
//     },
//     datesSet(arg) {
//         if (arg.view.type === 'dayGridMonth') {
//             const api = calendarRef.value.getApi()
//             api.getEvents()
//                 .filter((e) => e.display === 'background')
//                 .forEach((e) => e.remove())
//         }
//     },
//     dayHeaderClassNames(arg) {
//         // 특정 날짜 헤더에 클래스 붙여 배경색 변경
//         return arg.dateStr === selectedDate.value ? ['selected-day'] : []
//     },
//     dayCellClassNames(arg) {
//         // 실제 그리드 셀(td)에 클래스 붙이기
//         return currentView.value === 'dayGridWeek' && arg.dateStr === selectedDate.value
//             ? ['selected-day']
//             : []
//     },
//     eventClick: (info) => {
//         info.jsEvent.preventDefault()
//         info.jsEvent.stopPropagation()
//     },
// })

// 월 이름 배열

const calendarOptions = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    allDaySlot: false,
    weekends: false,

    // 한 행의 높이를 균일하게 분배
    contentHeight: 400,

    // 월별로 꼭 필요한 주만 표시
    fixedWeekCount: false,

    // 한 셀에 표시할 이벤트 최대 개수: 3개
    dayMaxEventRows: 2,
    dayMaxEvents: 3,

    // 전체 높이(픽셀 고정)는 제거하고 contentHeight만 사용
    // height: 500,  // 필요 없으면 주석 처리

    headerToolbar: {
        left: false,
        center: false,
        right: false,
    },

    views: {
        dayGridMonth: {
            // 이전/다음 달 날짜도 함께 보여줌
            showNonCurrentDates: true,
        },
        dayGridWeek: {
            dayHeaderFormat: { day: 'numeric' },
            showNonCurrentDates: false,
            fixedWeekCount: false,
            height: 0,
            dayMaxEventRows: 0,
            dayMaxEvents: 0,
        },
    },

    // events: [
    //     {
    //         id: '1', // (선택) 고유 ID
    //         title: '회의', // 캘린더에 표시될 텍스트
    //         start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
    //         end: '2025-07-23T10:00:00', // (선택) 종료 시각
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //         color: '#3a87ad', // (선택) 이벤트 색상
    //     },
    //     {
    //         id: '2', // (선택) 고유 ID
    //         title: '회의', // 캘린더에 표시될 텍스트
    //         start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
    //         end: '2025-07-23T10:00:00', // (선택) 종료 시각
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //         color: '#3a87ad', // (선택) 이벤트 색상
    //     },
    //     {
    //         id: '3', // (선택) 고유 ID
    //         title: '회의', // 캘린더에 표시될 텍스트
    //         start: '2025-07-23T09:00:00', // 시작 시각 (ISO 문자열 또는 Date 객체)
    //         end: '2025-07-23T10:00:00', // (선택) 종료 시각
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //         color: '#3a87ad', // (선택) 이벤트 색상
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
    //         end: '2025-08-12T16:00:00', // 2박 3일
    //         allDay: true,
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
    //         end: '2025-08-12T16:00:00', // 2박 3일
    //         allDay: true,
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
    //         end: '2025-08-12T16:00:00', // 2박 3일
    //         allDay: true,
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    //     {
    //         id: '4',
    //         title: '점심 약속',
    //         start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
    //         allDay: false, // 종일 여부 (true면 시간 무시)
    //     },
    // ],

    // events를 함수로 지정해서, API에서 받아온 데이터를 렌더링
    events: async (fetchInfo, successCallback, failureCallback) => {
        // 1) fetchInfo.startStr / endStr 로 API 요청
        // 2) 성공 시 successCallback(data)
        // 3) 실패 시 failureCallback(err)
        try {
            const res = await axios.get('/api/events', {
                params: {
                    start: fetchInfo.startStr, // YYYY-MM-DD 형식
                    end: fetchInfo.endStr,
                },
            })
            // API가 [{ title, start, end, allDay }, …] 형식의 배열을 반환한다고 가정
            // successCallback(res.data)
            successCallback([
                {
                    id: '1', // (선택) 고유 ID
                    title: '회의', // 캘린더에 표시될 텍스트
                    start: '2025-07-23', // 시작 시각 (ISO 문자열 또는 Date 객체)
                    end: '2025-07-23', // (선택) 종료 시각
                    allDay: false, // 종일 여부 (true면 시간 무시)
                    color: '#3a87ad', // (선택) 이벤트 색상
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
                    end: '2025-08-13',
                    allDay: true,
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-25', // 날짜만 쓰면 00:00부터 종일로 간주
                    end: '2025-08-13',
                    allDay: true,
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-16', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-09', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
                {
                    id: '4',
                    title: '점심 약속',
                    start: '2025-07-02', // 날짜만 쓰면 00:00부터 종일로 간주
                    allDay: true, // 종일 여부 (true면 시간 무시)
                },
            ])
        } catch (err) {
            console.error('이벤트 로드 실패', err)
            failureCallback(err)
        }
    },

    moreLinkClick: () => {},

    dateClick(info) {
        const api = calendarRef.value.getApi()
        selectedDate.value = info.dateStr
        changeView('dayGridWeek', info.date)
        currentView.value = 'dayGridWeek'
        api.getEvents()
            .filter((e) => e.display === 'background')
            .forEach((e) => e.remove())
        api.addEvent({ start: info.dateStr, allDay: true, display: 'background', color: '#FFE0B2' })
    },

    datesSet(arg) {
        if (arg.view.type === 'dayGridMonth') {
            const api = calendarRef.value.getApi()
            api.getEvents()
                .filter((e) => e.display === 'background')
                .forEach((e) => e.remove())
        }
    },

    dayHeaderClassNames(arg) {
        return arg.dateStr === selectedDate.value ? ['selected-day'] : []
    },

    dayCellClassNames(arg) {
        return currentView.value === 'dayGridWeek' && arg.dateStr === selectedDate.value
            ? ['selected-day']
            : []
    },

    eventClick(info) {
        info.jsEvent.preventDefault()
        info.jsEvent.stopPropagation()
    },
})

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

// 오늘 월, 일을 각각 계산
const todayMonth = computed(() => {
    const d = new Date()
    return monthNames[d.getMonth()]
})

const todayDay = computed(() => {
    return new Date().getDate()
})

// 이전 달/다음 달 넘어가는 함수
const monthMove = (move) => {
    const api = calendarRef.value.getApi()
    if (move === 'prev') api.prev()
    else if (move === 'today') api.today()
    else api.next()
}

// 뷰 변경 함수
function changeView(viewName, date) {
    console.log('click')
    currentView.value = viewName
    const api = calendarRef.value.getApi()

    // height 조절
    if (viewName === 'dayGridWeek') {
        api.setOption('height', 85) // 원하는 높이로 설정
    } else {
        api.setOption('height', 500)
    }

    // 뷰 변경 dayGridMonth <-> dayGridWeek
    if (date) {
        api.changeView(viewName, date)
    } else {
        api.changeView(viewName)
    }
}

// 달력 타이틀 설정 ()
watch(currentView, (val) => {
    headerTitle.value = val === 'dayGridMonth' ? '' : '세부 일정'
})
</script>
<style>
/* 1. 전체 테이블·셀 border 제거 */
.fc,
.fc table,
.fc thead,
.fc tbody,
.fc tr,
.fc th,
.fc td {
    border: none !important;
    border-collapse: collapse !important;
}

/* 2. 셀 높이 균일을 위한 overflow 제어 및 패딩 확보 */
/* .fc .fc-daygrid-day-frame {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: center !important;
    padding-top: 1.5em !important;
    overflow: hidden !important;
} */
.fc-daygrid-week-view .fc-daygrid-day-frame {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    overflow: hidden !important;
}

/* 3. 날짜 숫자 중앙 정렬 */
.fc .fc-daygrid-day-number {
    margin: 0 !important;
    text-align: center !important;
}

/* 4. 이벤트 제목 중앙 정렬, 클릭 비활성화 */
.fc .fc-event,
.fc .fc-event-title {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    pointer-events: none !important;
}

/* 5. 월간뷰에서 +n more 링크는 3개 초과 시에만 표시 */
.fc .fc-daygrid-more-link {
    display: inline-block !important;
    font-size: 0.85rem !important;
    margin-top: 0.2em !important;
}

/* 6. 선택된 날짜 배경색 (필요 시) */
.fc .selected-day {
    background-color: #ffe0b2 !important;
}

/* ② 주간뷰에서 각 row(tr)의 높이를 0으로 강제 */
.fc .fc-dayGridWeek .fc-daygrid-body tr {
    height: 0 !important;
    line-height: 0 !important;
}

/* 프레임 영역도 padding 없이 0으로 */
.fc .fc-dayGridWeek .fc-daygrid-day-frame {
    padding: 0 !important;
    min-height: 0 !important;
}

/* 날짜 숫자 보이길 원하시면 분리해서 다시 padding 주시고,
   완전히 숨기길 원하시면 아래처럼 처리하세요. */
.fc .fc-dayGridWeek .fc-daygrid-day-number {
    display: none !important;
}

/* “+n more” 클릭 시 나타나는 팝오버 전부 숨기기 */
.fc-popover,
.fc-more-popover,
.fc-daygrid-more-popover {
    display: none !important;
}

/* +n more 링크 클릭 비활성화 */
.fc .fc-daygrid-more-link {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important; /* 색상도 기본 텍스트처럼 변경(선택) */
    text-decoration: none !important; /* 밑줄 제거(선택) */
}

/* 주간(dayGridWeek)뷰 이벤트 컨테이너 중앙 정렬 */
.fc-daygrid-week-view .fc-daygrid-day-frame {
    /* 셀 자체를 flex 컨테이너로 전환 */
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important; /* 기존 패딩 제거 */
}

/* 이벤트 박스 자체를 중앙으로 정렬 */
.fc-daygrid-week-view .fc-event {
    /* margin:auto 로 감싸고 있는 flex 컨테이너 안에서 중앙에 놓이게 함 */
    margin: auto !important;
    position: static !important; /* 절대배치가 아닐 경우엔 static */
}

/* 이벤트 내부 텍스트도 중앙 정렬 */
.fc-daygrid-week-view .fc-event .fc-event-title,
.fc-daygrid-week-view .fc-event .fc-event-time {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
}
</style>
