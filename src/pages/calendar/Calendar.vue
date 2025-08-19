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
                        <!-- 이전 달 -->
                        <button
                            class="w-8 m-1 flex justify-center items-center border rounded"
                            @click="handleMonthMove('prev')"
                        >
                            <ChevronLeft />
                        </button>

                        <!-- ✅ 가운데: 현재 표시 중인 '월'만 -->
                        <span
                            class="flex items-center px-4 py-2 font-semibold rounded-lg pointer-events-none"
                        >
                            {{ displayedMonth }}
                            <!-- 예: 2025년 8월 -->
                        </span>

                        <!-- 오른쪽: 다음 달 + 오늘 버튼 -->
                        <div class="flex items-center gap-2">
                            <button
                                class="w-8 m-1 flex justify-center items-center border rounded"
                                @click="handleMonthMove('next')"
                            >
                                <ChevronRight />
                            </button>
                            <!-- ✅ 오늘 버튼: 오늘 날짜 보여주고 클릭 시 today로 이동 -->
                            <button
                                class="px-3 h-8 m-1 flex items-center justify-center border rounded text-sm hover:bg-gray-50"
                                @click="handleMonthMove('today')"
                            >
                                오늘 날짜로
                            </button>
                        </div>
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
            <!-- 화면 오른쪽 하단 챗봇 플로팅 -->
            <div class="fixed bottom-[78px] right-4 z-50">
                <div class="bg-[#00AEFF] rounded-full p-3 shadow-lg">
                    <BotMessageSquare class="text-white" @click="goToChatbot" />
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
import { BotMessageSquare } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
// 상태값(reactive/ref)
const calendarRef = ref(null) // FullCalendar DOM 접근 ref
const showCalendar = ref(true) // 월간 뷰(true)/주간 뷰(false)
const subscriptions = ref([]) // 청약 공고 리스트
const selectedDate = ref('') // 사용자가 선택한 날짜 (YYYY-MM-DD)
const selectedWeekRange = ref([]) // 주간 날짜 배열
const viewDate = ref(new Date()) // 현재 어떤 달인지 보여주는 기능
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

// ✅ 가운데에 보여줄 'YYYY년 M월'
const displayedMonth = computed(() => {
    const d = viewDate.value
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
})

// 오늘 레이블용 (오른쪽 버튼에 사용)
const MONTH_NAMES_SHORT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const todayMonthShort = computed(() => MONTH_NAMES_SHORT[new Date().getMonth()])

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

const colors = ['#fdcedf', '#a6e3ff', '#baffc9', '#FFD59E']
const eventColorMap = {} // 이벤트 ID별로 한 번만 색을 할당

// FullCalendar 옵션 (월간 뷰만)
const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    displayEventTime: false,
    contentHeight: 350,
    fixedWeekCount: false,
    dayMaxEvents: 2,
    headerToolbar: { left: false, center: false, right: false },
    views: { dayGridMonth: { showNonCurrentDates: true } },
    events: loadCalendarEvents,
    dateClick: handleDateClick,
    moreLinkClick: handleMoreClick,

    // ✅ 뷰가 바뀔 때마다(이전/다음/오늘 이동 포함) 현재 보여주는 월 기준 날짜 갱신
    datesSet(info) {
        // info.view.currentStart: 현재 뷰의 기준 시작일(월 뷰의 해당 월 내부 날짜)
        viewDate.value = new Date(info.view.currentStart)
    },
    eventDidMount({ event, el }) {
        // 1) 고유 키 생성 (pblanc_no가 없으면 시작일 기준)
        const key = event.extendedProps.pblanc_no || event.startStr

        // 2) 키가 없으면 다음 색을 지정
        if (!eventColorMap[key]) {
            const idx = Object.keys(eventColorMap).length
            eventColorMap[key] = colors[idx % colors.length]
        }

        // 3) 스타일 적용
        const color = eventColorMap[key]
        el.style.backgroundColor = color
        el.style.borderColor = color
    },
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

const goToChatbot = () => {
    router.push('/chatbot')
}
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
/* .fc .fc-event { */
/* background-color: #ffccda !important;
    color: #000000 !important;
    border: 2px solid #ffccda !important;  */
/* 이벤트 전체의 테두리(초록) */
/* border-radius: 0.375rem !important;
    margin-bottom: 0.25rem !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    display: flex !important;
    justify-content: center;
    align-items: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
} */
/* .fc .fc-event:nth-child(odd) {
    background-color: #ffccda !important;
    opacity: 0.9;
} */

.fc .fc-event {
    color: #000000 !important;
    border-radius: 0.375rem !important;
    margin-bottom: 0.25rem !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    display: flex !important;
    justify-content: center;
    align-items: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    border-width: 2px !important;
    border-style: solid !important;
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
