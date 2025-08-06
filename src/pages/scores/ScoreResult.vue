<!-- src/pages/ScoreResultPage.vue -->
<template>
    <div class="min-h-screen bg-white px-4 pt-20 pb-10 relative">
        <BackHeader title="가점 계산기" />

        <!-- 헤드라인 -->
        <h2 class="text-xl font-extrabold mb-6">내 주택 청약 예상 점수</h2>

        <!-- 링 차트 + 총점 -->
        <div class="flex flex-col items-center mb-8">
            <div class="relative">
                <svg width="150" height="150">
                    <!-- 배경 서클 -->
                    <circle cx="75" cy="75" r="70" stroke="#eee" stroke-width="10" fill="none" />
                    <!-- 진행도 서클 -->
                    <circle
                        cx="75"
                        cy="75"
                        r="70"
                        stroke="#76C9F2"
                        stroke-width="10"
                        fill="none"
                        stroke-linecap="round"
                        :stroke-dasharray="circumference"
                        :stroke-dashoffset="circumference - (totalScore / maxTotal) * circumference"
                        transform="rotate(-90 75 75)"
                    />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-extrabold">{{ totalScore }}</span>
                    <span class="text-sm text-gray-500">{{ maxTotal }}점 만점</span>
                </div>
            </div>

            <!-- 정보 수정하기 버튼 -->
            <button @click="goInfo" class="mt-4 text-sm text-blue-500 hover:underline">
                정보 수정하기
            </button>
        </div>

        <!-- 파트별 점수 리스트 -->
        <ul class="divide-y divide-gray-200 mb-8">
            <!-- 무주택 기간 -->
            <li class="flex justify-between items-center py-4">
                <div class="flex items-center gap-2">
                    <HomeIcon class="w-5 h-5 text-gray-600" />
                    <span>무주택 기간 점수</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="font-semibold">{{ noHouseScore }}점</span>
                    <span class="text-gray-500">/ 32점</span>
                    <ChevronRightIcon
                        @click="openModal('noHouse')"
                        class="w-4 h-4 text-gray-400 ml-2 cursor-pointer"
                    />
                </div>
            </li>

            <!-- 부양가족 수 -->
            <li class="flex justify-between items-center py-4">
                <div class="flex items-center gap-2">
                    <UsersIcon class="w-5 h-5 text-gray-600" />
                    <span>부양가족 점수</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="font-semibold">{{ familyScore }}점</span>
                    <span class="text-gray-500">/ 35점</span>
                    <ChevronRightIcon
                        @click="openModal('family')"
                        class="w-4 h-4 text-gray-400 ml-2 cursor-pointer"
                    />
                </div>
            </li>

            <!-- 청약통장 가입기간 -->
            <li class="flex justify-between items-center py-4">
                <div class="flex items-center gap-2">
                    <CalendarIcon class="w-5 h-5 text-gray-600" />
                    <span>청약통장 가입기간 점수</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="font-semibold">{{ accountScore }}점</span>
                    <span class="text-gray-500">/ 17점</span>
                    <ChevronRightIcon
                        @click="openModal('account')"
                        class="w-4 h-4 text-gray-400 ml-2 cursor-pointer"
                    />
                </div>
            </li>
        </ul>

        <!-- 홈으로 가기 버튼 -->
        <div class="px-4">
            <button
                @click="goHome"
                class="w-full py-3 bg-blue-500 text-white font-bold rounded-full shadow"
            >
                홈으로 가기
            </button>
        </div>

        <!-- 📌 점수표 모달 -->
        <transition name="fade">
            <div
                v-if="modalVisible"
                class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40"
                @click.self="modalVisible = false"
            >
                <div
                    class="bg-white w-full max-w-md rounded-t-2xl p-4 pb-safe safe-bottom overflow-auto"
                >
                    <!-- 모달 헤더 -->
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
                        <button
                            @click="modalVisible = false"
                            class="text-gray-500 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <!-- 타입별 표 렌더링 -->
                    <div class="text-sm text-center">
                        <!-- 무주택 기간 표 -->
                        <table v-if="modalType === 'noHouse'" class="w-full table-fixed text-xs">
                            <tr class="bg-gray-50">
                                <th>기간</th>
                                <th>점수</th>
                                <th>기간</th>
                                <th>점수</th>
                            </tr>
                            <tr v-for="(row, i) in noHouseTable" :key="i">
                                <td class="py-2">{{ row.left.range }}</td>
                                <td :class="highlightClass('noHouse', row.left.score)">
                                    {{ row.left.score }}점
                                </td>
                                <td class="py-2">{{ row.right.range }}</td>
                                <td :class="highlightClass('noHouse', row.right.score)">
                                    {{ row.right.score }}점
                                </td>
                            </tr>
                        </table>

                        <!-- 부양가족 수 표 -->
                        <table v-if="modalType === 'family'" class="w-full table-fixed text-xs">
                            <tr class="bg-gray-50">
                                <th>가족 수</th>
                                <th>점수</th>
                                <th>가족 수</th>
                                <th>점수</th>
                            </tr>
                            <tr v-for="(row, i) in familyTable" :key="i">
                                <td class="py-2">{{ row.left.count }}명</td>
                                <td :class="highlightClass('family', row.left.score)">
                                    {{ row.left.score }}점
                                </td>
                                <td class="py-2">{{ row.right.count }}명</td>
                                <td :class="highlightClass('family', row.right.score)">
                                    {{ row.right.score }}점
                                </td>
                            </tr>
                        </table>

                        <!-- 통장 가입기간 표 -->
                        <table v-if="modalType === 'account'" class="w-full table-fixed text-xs">
                            <tr class="bg-gray-50">
                                <th>기간</th>
                                <th>점수</th>
                                <th>기간</th>
                                <th>점수</th>
                            </tr>
                            <tr v-for="(row, i) in accountTable" :key="i">
                                <td class="py-2">{{ row.left.range }}</td>
                                <td :class="highlightClass('account', row.left.score)">
                                    {{ row.left.score }}점
                                </td>
                                <td class="py-2">{{ row.right.range }}</td>
                                <td :class="highlightClass('account', row.right.score)">
                                    {{ row.right.score }}점
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- 닫기 버튼 -->
                    <button
                        @click="modalVisible = false"
                        class="mt-6 w-full py-3 border border-gray-300 rounded-full text-gray-700 font-medium"
                    >
                        확인
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import BackHeader from '@/components/common/BackHeader.vue'
import {
    Home as HomeIcon,
    Users as UsersIcon,
    Calendar as CalendarIcon,
    ChevronRight as ChevronRightIcon,
} from 'lucide-vue-next'

const router = useRouter()
const scoreStore = useScoreStore()

onMounted(async () => {
    try {
        const res = await scoreStore.fetchScoreFromServer()
        await scoreStore.calculateScore()
        console.log('[ScoreResultPage] 점수 정보 최신화 완료')
    } catch (e) {
        console.error('[ScoreResultPage] 점수 정보 불러오기 실패:', e)
    }
})

// 모달 상태
const modalVisible = ref(false)
const modalType = ref('') // 'noHouse' | 'family' | 'account'

// 링 차트 계산용
const totalScore = computed(() => scoreStore.result.total_ga_score || 0)
const maxTotal = 84
const circumference = 2 * Math.PI * 70

// 파트별 점수
const noHouseScore = computed(() => scoreStore.result.no_house_score || 0)
const familyScore = computed(() => scoreStore.result.dependents_score || 0)
const accountScore = computed(() => scoreStore.result.payment_period_score || 0)

// 모달 오픈
function openModal(type) {
    modalType.value = type
    modalVisible.value = true
}

// 모달 제목
const modalTitle = computed(() => {
    switch (modalType.value) {
        case 'noHouse':
            return '무주택 기간 점수'
        case 'family':
            return '부양가족 수 점수'
        case 'account':
            return '청약통장 가입기간 점수'
        default:
            return ''
    }
})

// 점수표 데이터 (원본 그대로)
const noHouseTable = [
    { left: { range: '1년 미만', score: 2 }, right: { range: '8년 이상 ~ 9년 미만', score: 18 } },
    {
        left: { range: '1년 이상 ~ 2년 미만', score: 4 },
        right: { range: '9년 이상 ~ 10년 미만', score: 20 },
    },
    {
        left: { range: '2년 이상 ~ 3년 미만', score: 6 },
        right: { range: '10년 이상 ~ 11년 미만', score: 22 },
    },
    {
        left: { range: '3년 이상 ~ 4년 미만', score: 8 },
        right: { range: '11년 이상 ~ 12년 미만', score: 24 },
    },
    {
        left: { range: '4년 이상 ~ 5년 미만', score: 10 },
        right: { range: '12년 이상 ~ 13년 미만', score: 26 },
    },
    {
        left: { range: '5년 이상 ~ 6년 미만', score: 12 },
        right: { range: '13년 이상 ~ 14년 미만', score: 28 },
    },
    {
        left: { range: '6년 이상 ~ 7년 미만', score: 14 },
        right: { range: '14년 이상 ~ 15년 미만', score: 30 },
    },
    { left: { range: '7년 이상 ~ 8년 미만', score: 16 }, right: { range: '15년 이상', score: 32 } },
]

const familyTable = [
    { left: { count: '0명', score: 5 }, right: { count: '4명', score: 25 } },
    { left: { count: '1명', score: 10 }, right: { count: '5명', score: 30 } },
    { left: { count: '2명', score: 15 }, right: { count: '6명 이상', score: 35 } },
    { left: { count: '3명', score: 20 }, right: { count: '', score: null } },
]

const accountTable = [
    { left: { range: '6개월 미만', score: 1 }, right: { range: '8년 이상 ~ 9년 미만', score: 10 } },
    {
        left: { range: '6개월 이상 ~ 1년 미만', score: 2 },
        right: { range: '9년 이상 ~ 10년 미만', score: 11 },
    },
    {
        left: { range: '1년 이상 ~ 2년 미만', score: 3 },
        right: { range: '10년 이상 ~ 11년 미만', score: 12 },
    },
    {
        left: { range: '2년 이상 ~ 3년 미만', score: 4 },
        right: { range: '11년 이상 ~ 12년 미만', score: 13 },
    },
    {
        left: { range: '3년 이상 ~ 4년 미만', score: 5 },
        right: { range: '12년 이상 ~ 13년 미만', score: 14 },
    },
    {
        left: { range: '4년 이상 ~ 5년 미만', score: 6 },
        right: { range: '13년 이상 ~ 14년 미만', score: 15 },
    },
    {
        left: { range: '5년 이상 ~ 6년 미만', score: 7 },
        right: { range: '14년 이상 ~ 15년 미만', score: 16 },
    },
    { left: { range: '6년 이상 ~ 7년 미만', score: 8 }, right: { range: '15년 이상', score: 17 } },
    { left: { range: '7년 이상 ~ 8년 미만', score: 9 }, right: { range: '', score: null } },
]

// 하이라이트 클래스
function highlightClass(type, score) {
    if (type === 'noHouse' && score === noHouseScore.value)
        return 'bg-blue-100 text-blue-600 font-bold'
    if (type === 'family' && score === familyScore.value)
        return 'bg-blue-100 text-blue-600 font-bold'
    if (type === 'account' && score === accountScore.value)
        return 'bg-blue-100 text-blue-600 font-bold'
    return ''
}

function goHome() {
    router.push('/home')
}
function goInfo() {
    router.push('/score/info')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
