<template>
    <!-- 전체 화면 컨테이너 -->
    <div class="flex flex-1 flex-col bg-white text-center px-4">
        <!-- 상단 뒤로가기 및 타이틀 헤더 -->
        <BackHeader title="달력 보기" />

        <main
            class="fixed top-0 left-0 w-full px-1 py-6 space-y-6 pt-[70px] pb-[70px] flex flex-col inset-0"
        >
            <div class="flex-none w-full h-full overflow-hidden">
                <!-- 달력 헤더(월 이동/오늘 버튼) -->
                <div class="flex items-center mt-1 mb-2">
                    <div
                        v-if="showCalendar"
                        class="relative w-full h-6 rounded flex justify-between items-center m-1 mt-4"
                    >
                        <button
                            class="w-8 m-1 flex justify-center items-center border"
                            @click="handleMonthMove('prev')"
                        >
                            <ChevronLeft />
                        </button>
                        <span
                            class="flex flex-col items-center px-4 py-2 font-medium rounded-lg shadow focus:outline-none focus:ring-2 transition z-50"
                            @click="handleMonthMove('today')"
                        >
                            <span class="text-sm text-center mb-1">{{ todayMonth }}</span>
                            <span class="text-lg font-semibold -mt-1">{{ todayDay }}</span>
                        </span>
                        <button
                            class="w-8 m-1 flex justify-center items-center border"
                            @click="handleMonthMove('next')"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                <!-- FullCalendar 월간 달력 뷰 -->
                <FullCalendar
                    v-if="showCalendar"
                    ref="calendarRef"
                    :options="calendarOptions"
                    class="h-[90%] fc-toolbar-title border border-red-500"
                />

                <!-- 주간 뷰 헤더: 월간 뷰로 돌아가기 + 타이틀 -->
                <div v-if="!showCalendar" class="relative w-full h-6 rounded flex items-center m-1">
                    <span
                        @click="backToMonth"
                        class="w-8 m-1 flex justify-center items-center border"
                    >
                        <ArrowLeft />
                    </span>
                    <!-- 주간 뷰 타이틀 -->
                    <div
                        class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center pointer-events-none"
                    >
                        <h2 class="inline-block text-lg font-semibold px-2">세부 일정</h2>
                    </div>
                </div>

                <!-- 커스텀 주별 달력 -->
                <div
                    v-if="!showCalendar"
                    class="w-full h-10 flex justify-between items-center mt-5"
                >
                    <div
                        v-for="(day, index) in selectedWeekRange"
                        :key="index"
                        class="w-[20%] h-full flex justify-center items-center cursor-pointer"
                        :class="{ 'bg-[#ffe0b2] rounded': selectedDate === day }"
                        @click="selectedDate = day"
                    >
                        {{ Number(day.split('-')[2]) }}
                    </div>
                </div>

                <!-- 청약 공고 리스트(주간 뷰 하단) -->
                <div
                    v-if="!showCalendar"
                    class="flex-1 w-full h-full overflow-y-auto border-t pb-[40px]"
                >
                    <div class="flex-1 px-4 py-4 pb-20">
                        <div v-if="filteredSubscriptions.length === 0" class="text-center py-12">
                            <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
                        </div>
                        <div class="space-y-4">
                            <SubscriptionCard
                                v-for="subscription in filteredSubscriptions"
                                :key="subscription.id"
                                :subscription="subscription"
                                :favorite-default="true"
                                @favorite-changed="removeCalendar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 하단 네비게이션 바 -->
        <BottomNavBar />
    </div>
</template>

<script setup>
// import 및 전역 변수/상수 선언
import { ref, reactive, watch, computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavBar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

// 상태값(reactive/ref)
const calendarRef = ref(null) // FullCalendar DOM 접근 ref
const showCalendar = ref(true) // 월간 뷰(true)/주간 뷰(false)
const subscriptions = ref([]) // 청약 공고 리스트
const selectedDate = ref('') // 사용자가 선택한 날짜 (YYYY-MM-DD)
const selectedWeekRange = ref([]) // 주간 날짜 배열

const favorite = useFavoritesStore()

// 날짜/월 텍스트
const MONTH_NAMES = [
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
const todayMonth = computed(() => MONTH_NAMES[new Date().getMonth()])
const todayDay = computed(() => new Date().getDate())

// 청약 공고 리스트 정렬
const filteredSubscriptions = computed(() => {
    if (showCalendar.value) {
        const result = Array.isArray(subscriptions.value) ? [...subscriptions.value] : []

        return result.sort((a, b) => {
            const aStartDate = new Date(a?.start || '2099-12-31')
            const bStartDate = new Date(b?.start || '2099-12-31')
            return aStartDate - bStartDate
        })
    } else {
        return (Array.isArray(subscriptions.value) ? subscriptions.value : []).filter((item) =>
            new Date().betweenDate(item.start, item.end, selectedDate.value),
        )
    }
})

// FullCalendar 옵션 (월간 뷰만)
const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    // allDaySlot: false, // 종일 슬롯 비활성화
    displayEventTime: false,
    contentHeight: 350,
    fixedWeekCount: false,
    dayMaxEvents: 1,
    headerToolbar: { left: false, center: false, right: false },
    views: { dayGridMonth: { showNonCurrentDates: true } },
    events: loadCalendarEvents, // 이벤트(청약 데이터) 동적 로드
    dateClick: handleDateClick, // 날짜 클릭 이벤트
    moreLinkClick: handleMoreClick,
})

// API에서 데이터 로딩
async function loadCalendarEvents(fetchInfo, successCallback, failureCallback) {
    try {
        const res = await favorite.getFavorite()
        console.log('res /; ', res)
        subscriptions.value = res
        successCallback(res)
    } catch (err) {
        console.error('이벤트 로드 실패', err)
        failureCallback(err)
    }
}

async function removeCalendar(subscription) {
    try {
        let param = {
            house_type: subscription.house_type,
            pblanc_no: subscription.pblanc_no,
        }
        const res = await favorite.removeFavorite(param)
        subscriptions.value = res
    } catch (e) {
        console.log(e)
    }
}

// 달력 날짜 클릭 핸들러: 주간 뷰로 전환
function handleDateClick(info) {
    selectedDate.value = info.dateStr
    generateWeekRange(info.dateStr)
    showCalendar.value = false // 주간 뷰로 전환
}

// + more 클릭 핸들러: 주간 뷰로 전환
function handleMoreClick(info) {
    selectedDate.value = info.dateStr || info.date?.toISOString().slice(0, 10)
    generateWeekRange(selectedDate.value)
    showCalendar.value = false
    // 팝업은 뜨지 않도록 false 반환
    return false
}

// 월 이동/오늘 버튼 핸들러 (getApi null 방지)
function handleMonthMove(direction) {
    // FullCalendar가 mount 전에는 calendarRef.value가 null일 수 있음
    if (!calendarRef.value) return
    const api = calendarRef.value.getApi()
    if (!api) return
    if (direction === 'prev') api.prev()
    else if (direction === 'today') api.today()
    else if (direction === 'next') api.next()
}

// 주간 날짜 배열 생성 (월~금 5일)
function generateWeekRange(dateStr) {
    const date = new Date(dateStr)
    const day = date.getDay()
    // 월요일이 1, 일요일이 0
    const mondayOffset = day === 0 ? -6 : 1 - day
    const monday = new Date(date)
    monday.setDate(date.getDate() + mondayOffset)
    selectedWeekRange.value = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return new Date().dateStringFormat(d, '-')
    })
}

// 월간 뷰로 돌아가기 (주간 → 월간)
function backToMonth() {
    showCalendar.value = true
}

// 달력 보이기/숨기기 상태 감시 (필요시 렌더)
watch(showCalendar, (val) => {
    if (val && calendarRef.value) {
        calendarRef.value.getApi().render()
    }
})
</script>
<style>
/* FullCalendar 스타일(월간 뷰) */
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

/* 월간뷰 날짜 숫자 수평(가로) 중앙정렬만 적용! */
.fc .fc-daygrid-day-number {
    display: block !important;
    text-align: center !important;
    width: 100% !important;
    font-weight: 600 !important;
    color: #374151 !important;
    padding: 4px !important;
    margin: 0 !important;
}

.fc .fc-daygrid-day-frame {
    padding: 0px !important;
    min-height: 70px !important;
}

/* 이하 기존 스타일 */
.fc .fc-event,
.fc .fc-event-title {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    pointer-events: none !important;
    position: static !important;
    margin: auto !important;
}
.fc .fc-event * {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
}
.fc .selected-day {
    background-color: #ffe0b2 !important;
}
.fc .fc-daygrid-day-frame,
.fc .fc-scroller {
    padding-left: 0.2rem !important;
    padding-right: 0.2rem !important;
}
.fc .fc-event {
    background-color: #d1fae5 !important;
    color: #000000 !important;
    border: 2px solid #d1fae5 !important; /* 이벤트 전체의 테두리(초록) */
    border-radius: 0.375rem !important;
    margin-bottom: 0.25rem !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    display: flex !important;
    justify-content: center;
    align-items: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
.fc .fc-event:nth-child(odd) {
    background-color: #d1fae5 !important;
}

.fc .fc-event,
.fc .fc-event-title,
.fc .fc-event-main {
    width: 100%;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    color: #000000 !important;
}

/* +n more 링크 수평 가운데 정렬 */
.fc .fc-daygrid-more-link {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    margin: 0 auto !important;
}
</style>
