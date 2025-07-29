<template>
    <div class="flex flex-col min-h-screen bg-white">
        <!-- 상단 헤더 -->
        <BackHeader title="내 청약 정보" />
        <div class="mt-20"></div>
        <!-- 리스트 -->
        <ul class="flex-1 divide-y divide-gray-200">
            <!-- 생년월일 (수정 불가) -->
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

            <!-- 지역 거주기간 -->
            <li class="flex justify-between items-center px-4 py-5">
                <div class="flex items-center gap-3">
                    <MapPinIcon class="w-6 h-6 text-gray-500" />
                    <div class="space-y-1">
                        <p class="text-xs text-gray-500">지역 거주기간</p>
                        <p class="text-base font-semibold text-gray-800">
                            {{ scoreStore.residence.city }} {{ scoreStore.residence.district }} /
                            {{ scoreStore.residence.startDate }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(6)"
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
                        <p class="text-base font-semibold text-gray-800">
                            {{ scoreStore.isHouseholdHead === 'yes' ? '세대주' : '세대원' }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(3)"
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
                        <p class="text-base font-semibold text-gray-800">
                            {{ scoreStore.houseOwned === 'yes' ? '무주택' : '소유 중' }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(1)"
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
                        <p class="text-base font-semibold text-gray-800">
                            {{
                                scoreStore.houseDisposed === 'yes'
                                    ? `처분 / ${scoreStore.disposedDate}`
                                    : '미처분'
                            }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(2)"
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
                        <p class="text-base font-semibold text-gray-800">
                            {{
                                scoreStore.isMarried === 'yes'
                                    ? `기혼 / ${scoreStore.marriageDate}`
                                    : '미혼'
                            }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(4)"
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
                        <p class="text-base font-semibold text-gray-800">{{ totalDependents }}명</p>
                    </div>
                </div>
                <button
                    @click="pushStep(5)"
                    class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                >
                    수정
                </button>
            </li>

            <!-- 통장 가입 연월 -->
            <li class="flex justify-between items-center px-4 py-5">
                <div class="flex items-center gap-3">
                    <CalendarIcon class="w-6 h-6 text-gray-500" />
                    <div class="space-y-1">
                        <p class="text-xs text-gray-500">통장 가입 연월</p>
                        <p class="text-base font-semibold text-gray-800">
                            {{ scoreStore.accountStartDate }}
                        </p>
                    </div>
                </div>
                <button
                    @click="pushStep(7)"
                    class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
                >
                    수정
                </button>
            </li>
        </ul>

        <!-- 확인 버튼 -->
        <div class="px-4 pb-6">
            <button
                @click="router.push('/score/result')"
                class="w-full py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg"
            >
                확인
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
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
const scoreStore = useScoreStore()
const userStore = useUserStore()

// formattedBirth, age, totalDependents 계산 (이전 코드 그대로)
const formattedBirth = computed(() => {
    const d = new Date(userStore.birthDate)
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`
})
const age = computed(() =>
    Math.floor(
        (Date.now() - new Date(userStore.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365),
    ),
)
const totalDependents = computed(
    () =>
        scoreStore.dependents.spouse +
        scoreStore.dependents.parents +
        scoreStore.dependents.children,
)

// 수정하기 스텝 이동
const pushStep = (step) => router.push(`/score/step${step}`)
</script>
