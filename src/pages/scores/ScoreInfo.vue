<!-- src/pages/ScoreInfoPage.vue -->
<template>
    <div class="flex flex-col min-h-screen bg-white">
        <BackHeader title="내 청약 정보" />
        <div class="mt-16">
            <ul class="flex-1 divide-y divide-gray-200">
                <!-- 생년월일 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <CalendarIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">생년월일</p>
                            <p class="text-base font-semibold text-gray-800">
                                {{ formattedBirth }} (만 {{ age }}세)
                            </p>
                        </div>
                    </div>
                </li>

                <!-- 무주택 기간 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <HomeIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">무주택 기간</p>
                            <p class="text-base font-semibold text-gray-800">
                                {{ store.noHousePeriod }}년
                            </p>
                        </div>
                    </div>
                </li>

                <!-- 거주 시작 연월 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <MapPinIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">거주 시작 연월</p>
                            <p class="text-base font-semibold text-gray-800">
                                {{ formattedResidenceDate }}
                            </p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(6)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>

                <!-- 세대주 여부 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <HomeIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">세대주 여부</p>
                            <p class="text-base font-semibold text-gray-800">{{ headLabel }}</p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(3)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>

                <!-- 주택 소유 여부 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <HomeIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">주택 소유 유무</p>
                            <p class="text-base font-semibold text-gray-800">{{ ownerLabel }}</p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(1)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>

                <!-- 주택 처분 여부 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <TrashIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">주택 처분 유무</p>
                            <p class="text-base font-semibold text-gray-800">{{ disposalLabel }}</p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(2)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>

                <!-- 혼인 여부 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <UserCheckIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">혼인 여부</p>
                            <p class="text-base font-semibold text-gray-800">{{ maritalLabel }}</p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(4)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>

                <!-- 부양가족 수 -->
                <li class="flex justify-between items-center px-4 py-5">
                    <div class="flex items-center gap-3">
                        <UsersIcon class="w-6 h-6 text-gray-500" />
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500">부양가족 수</p>
                            <p class="text-base font-semibold text-gray-800">
                                {{ store.dependentsNm }}명
                            </p>
                        </div>
                    </div>
                    <button
                        @click="pushEdit(5)"
                        class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                    >
                        수정
                    </button>
                </li>
            </ul>

            <!-- 확인 버튼: 재계산 후 결과 페이지로 -->
            <div class="px-4 pt-5">
                <button
                    @click="confirmInfo"
                    class="w-full py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg"
                >
                    확인
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import { useUserStore } from '@/stores/user'
import BackHeader from '@/components/common/BackHeader.vue'
import {
    Calendar as CalendarIcon,
    MapPin as MapPinIcon,
    Home as HomeIcon,
    Users as UsersIcon,
    UserCheck as UserCheckIcon,
    Trash2 as TrashIcon,
} from 'lucide-vue-next'

const router = useRouter()
const store = useScoreStore()
const userStore = useUserStore()

// 순서: 로컬 입력값 먼저, 없으면 API 결과
const rawResidence = computed(() => store.residenceStartDate || store.result.residence_start_date)
const formattedResidenceDate = computed(() => {
    if (!rawResidence.value) return ''
    const [y, m] = rawResidence.value.split('-')
    return `${y}. ${m.padStart(2, '0')}`
})

// 페이지 진입 시 자동 재계산
onMounted(async () => {
    await store.calculateScore()
})

// 생년월일 포맷
const formattedBirth = computed(() => {
    const d = new Date(userStore.birthDate)
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(
        d.getDate(),
    ).padStart(2, '0')}`
})

// 나이 계산
const age = computed(() =>
    Math.floor((Date.now() - new Date(userStore.birthDate)) / (1000 * 60 * 60 * 24 * 365)),
)

// 레이블
const headLabel = computed(() => (store.headOfHousehold === 1 ? '세대주' : '세대원'))
const ownerLabel = computed(() => (store.houseOwner === 1 ? '소유 중' : '무주택'))
const disposalLabel = computed(() =>
    store.houseDisposal === 1 ? `처분 / ${store.disposalDate}` : '미처분',
)
const maritalLabel = computed(() =>
    store.maritalStatus === 1 ? `기혼 / ${store.weddingDate}` : '미혼',
)

// 수정 페이지 이동
function pushEdit(step) {
    router.push(`/score/edit/step${step}`)
}

// 확인 버튼 (재계산 후 결과 페이지)
async function confirmInfo() {
    await store.calculateScore()
    router.push('/score/result')
}
</script>
