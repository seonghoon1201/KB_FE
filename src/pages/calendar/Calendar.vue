<template>
    <div class="flex flex-1 flex-col bg-white text-center px-4">
        <BackHeader title="달력 보기" />
        <main class="w-full px-1 py-6 space-y-6 pt-[70px]">
            <div class="flex-1 w-full overflow-hidden">
                <div class="flex items-center">
                    <button class="relative w-full h-6 rounded flex items-center m-1">
                        <span
                            v-if="currentView === 'dayGridWeek'"
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
                    </button>
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
import { ref, reactive, watch } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavBar from '@/components/common/BottomNavbar.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarRef = ref(null) // 달력의 기능을 사용하는 ref
const selectedDate = ref('') // 선택된 날짜를 저장할 ref
const currentView = ref('dayGridMonth') // 달력의 뷰 설정
const headerTitle = ref('버튼 넣을 공간...') // 달력의 제목 설정

const calendarOptions = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: currentView.value,
    allDaySlot: false, // 주간뷰에서 all-day 슬롯(빈 행) 제거
    weekends: false,
    height: 500,
    expandRows: true, // 빈 공간 없이 최대한 꽉 채움
    headerToolbar: {
        left: false,
        center: false,
        right: false,
    }, // 헤더 툴바 숨김
    slotLabelFormat: [
        { hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' }, // top level of text
        { weekday: 'short' }, // lower level of text
    ], // 시간대 레이블 숨김
    views: {
        // 월간 뷰: 요일 이름만
        dayGridMonth: {
            dayHeaderFormat: { weekday: 'short' }, // Mon, Tue, Wed...
            height: 500,
        },
        // 주간 뷰: 날짜(숫자)만
        dayGridWeek: {
            dayHeaderFormat: { day: 'numeric' }, // 7, 8, 9...
            height: 100,
        },
    },
    dateClick(info) {
        const api = calendarRef.value.getApi()

        console.log('클릭된 날짜:', info.dateStr) // 'YYYY-MM-DD' 형식 문자열
        // info.date: JS Date 객체
        // info.dayEl: 클릭된 셀 DOM 요소
        // info.jsEvent: 원본 마우스 이벤트
        selectedDate.value = info.dateStr
        changeView('dayGridWeek', info.date)
        currentView.value = 'dayGridWeek'

        api.getEvents()
            .filter((e) => e.display === 'background')
            .forEach((e) => e.remove())

        api.addEvent({
            start: info.dateStr,
            allDay: true,
            display: 'background',
            color: '#FFE0B2',
        })
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
        // 특정 날짜 헤더에 클래스 붙여 배경색 변경
        return arg.dateStr === selectedDate.value ? ['selected-day'] : []
    },
    dayCellClassNames(arg) {
        // 실제 그리드 셀(td)에 클래스 붙이기
        return currentView.value === 'dayGridWeek' && arg.dateStr === selectedDate.value
            ? ['selected-day']
            : []
    },
})

// 뷰 변경 함수
function changeView(viewName, date) {
    console.log('click')
    currentView.value = viewName
    const api = calendarRef.value.getApi()

    // height 조절
    if (viewName === 'dayGridWeek') {
        api.setOption('height', 87) // 원하는 높이로 설정
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
