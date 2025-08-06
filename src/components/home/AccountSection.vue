<!-- src/components/AccountSection.vue -->
<template>
    <div class="w-full bg-white rounded-2xl border p-5 shadow-sm">
        <!-- ✅ 계좌 등록된 경우 -->
        <template v-if="hasAccount">
            <!-- 납입 상태 & 총 납입 횟수 -->
            <div class="flex justify-between items-center text-xs mb-4">
                <p :class="hasDepositThisMonth ? 'text-green-500' : 'text-red-500'">
                    {{
                        hasDepositThisMonth
                            ? '🟢 이번 달 청약 납입이 확인되었어요'
                            : '🔴 이번 달 청약 납입이 되지 않았어요'
                    }}
                </p>
                <span
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold whitespace-nowrap"
                >
                    • 총 납입 횟수: {{ resFinalRoundNo }}회
                </span>
            </div>

            <!-- 이미지 + 프로그래스 링 -->
            <div class="flex flex-col items-center gap-1">
                <div class="relative w-40 h-40 mb-2">
                    <svg class="absolute inset-0" width="160" height="160" viewBox="0 0 160 160">
                        <!-- 배경 원형 -->
                        <circle
                            cx="80"
                            cy="80"
                            :r="circleRadius"
                            fill="none"
                            stroke="#E5E7EB"
                            :stroke-width="strokeWidth"
                        />
                        <!-- 진행 원형 -->
                        <circle
                            cx="80"
                            cy="80"
                            :r="circleRadius"
                            fill="none"
                            stroke="#3B82F6"
                            :stroke-width="strokeWidth"
                            stroke-linecap="round"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="dashOffset"
                            transform="rotate(-90 80 80)"
                        />
                    </svg>
                    <img :src="imagePath" alt="zibi" class="relative w-40 h-40 object-contain" />
                </div>
                <p class="text-xs text-gray-400">{{ bankName }} {{ accountNumber }}</p>
                <p class="text-2xl font-extrabold text-black">{{ formattedBalance }}</p>
            </div>

            <!-- 예치금 달성률 -->
            <div class="mt-4">
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-blue-500 transition-all"
                        :style="{ width: depositRate + '%' }"
                    ></div>
                </div>
                <div class="text-center text-xs text-gray-400 mt-1">{{ depositRate }}%</div>

                <div class="text-xs mt-2 text-gray-500 text-center space-y-0.5">
                    <p>{{ formattedBalance }} / {{ formattedGoal }}</p>
                    <p v-if="depositRate < 100">
                        예치금 달성까지
                        <span class="text-red-500 font-semibold">{{ remainingAmount }}</span>
                        남았어요!
                    </p>
                    <p v-else class="text-blue-600 font-semibold">예치금 목표를 달성했어요!</p>
                </div>
            </div>

            <!-- 지역 및 평수 -->
            <div class="mt-6 flex justify-between text-sm text-gray-700 font-medium px-1">
                <p>
                    거주 지역 : <span class="font-normal">{{ region }}</span>
                </p>
                <p>
                    설정 평수 : <span class="font-normal">{{ areaLabel }}</span>
                </p>
            </div>

            <div class="mt-4">
                <PrimaryButton @click="showModal = true">📏 평수 설정</PrimaryButton>
            </div>

            <!-- 계좌 해지 버튼 -->
            <div class="mt-4 flex justify-center">
                <button
                    @click="showConfirmModal = true"
                    class="text-xs text-red-500 underline transition"
                >
                    계좌 연결 해지
                </button>
            </div>

            <ConfirmModal
                :visible="showConfirmModal"
                @confirm="disconnectAccount"
                @cancel="showConfirmModal = false"
            />

            <!-- 평수 설정 모달 -->
            <AreaSettingModal
                v-if="showModal"
                :modelValue="selectedArea"
                @close="showModal = false"
                @save="updateArea"
            />
        </template>

        <!-- ❌ 계좌 미등록 시 -->
        <template v-else>
            <div class="flex flex-col items-center gap-2">
                <img src="@/assets/images/zibi_0.png" alt="egg" class="w-40 h-40" />
                <p class="text-gray-600 text-xl font-bold">계좌를 연결해 주세요!</p>
                <p class="text-gray-500 text-sm text-center">
                    청약통장을 연결하면 예치금 현황과<br />
                    목표 달성률을 실시간으로 확인할 수 있어요
                </p>

                <ul class="text-left text-sm text-gray-700 space-y-1 mt-4 mb-2">
                    <li>✅ 실시간 잔액 확인</li>
                    <li>✅ 목표 달성률 추적</li>
                    <li>✅ 입금 확인</li>
                </ul>

                <PrimaryButton @click="onConnectAccount"> 계좌 연결하기 </PrimaryButton>
                <p class="text-[10px] text-gray-400 mt-2">
                    🔒 256bit SSL 암호화로 안전하게 보호됩니다
                </p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import AreaSettingModal from '@/components/modal/AreaSettingModal.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { useAccountStore } from '@/stores/account'
import { useUserStore } from '@/stores/user'

// zibi 이미지들
import zibi0 from '@/assets/images/zibi_0.png'
import zibi1 from '@/assets/images/zibi_1.png'
import zibi2 from '@/assets/images/zibi_2.png'
import zibi3 from '@/assets/images/zibi_3.png'
import zibi4 from '@/assets/images/zibi_4.png'
import zibi5 from '@/assets/images/zibi_5.png'

const router = useRouter()
const accountStore = useAccountStore()
const userStore = useUserStore()

// 예치금 기준표
const depositTable = {
    seoulBusan: { 85: 3000000, 102: 6000000, 135: 10000000, all: 15000000 },
    metro: { 85: 2500000, 102: 4000000, 135: 7000000, all: 10000000 },
    others: { 85: 2000000, 102: 3000000, 135: 4000000, all: 5000000 },
}

// 사용자 주소에서 '시 구'까지만 추출
const rawAddress = computed(() => userStore.address || '')
const region = computed(() => {
    const parts = rawAddress.value.split(' ')
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : rawAddress.value
})

// 지역 카테고리 판별
const regionCategory = computed(() => {
    const city = region.value.split(' ')[0]
    if (city === '서울' || city === '부산') return 'seoulBusan'
    if (['광주', '대구', '대전', '인천', '울산', '세종'].includes(city)) return 'metro'
    return 'others'
})

// 모달 상태
const showConfirmModal = ref(false)
const showModal = ref(false)

// 평수 설정
const selectedArea = ref(85)
const areaOptions = [
    { label: '~85㎡', value: 85 },
    { label: '85㎡ ~ 102㎡', value: 102 },
    { label: '102㎡ ~ 135㎡', value: 135 },
    { label: '135㎡ ~', value: 'all' },
]
const areaLabel = computed(() => {
    const o = areaOptions.find((o) => o.value === selectedArea.value)
    return o ? o.label : `${selectedArea.value}㎡`
})
const updateArea = (val) => {
    selectedArea.value = val
    showModal.value = false
}

// 계좌 연결 여부 & 데이터
const hasAccount = computed(() => accountStore.isRegistered)
const balance = computed(() => Number(accountStore.accountBalance))
const accountNumber = computed(() => accountStore.accountDisplay)
const bankName = computed(() => accountStore.selectedBankName)
const hasDepositThisMonth = computed(() => accountStore.isPayment)
const resFinalRoundNo = computed(() => accountStore.resFinalRoundNo)

// 동적 goal 계산
const goal = computed(() => {
    const tbl = depositTable[regionCategory.value]
    return tbl[selectedArea.value] ?? tbl.all
})

// 달성률 & 포맷팅
const depositRate = computed(() => Math.floor(Math.min(100, (balance.value / goal.value) * 100)))
const formattedBalance = computed(() => balance.value.toLocaleString('ko-KR') + '원')
const formattedGoal = computed(() => goal.value.toLocaleString('ko-KR') + '원')
const remainingAmount = computed(() => {
    const rem = goal.value - balance.value
    return rem > 0 ? rem.toLocaleString('ko-KR') + '원' : '0원'
})

// 프로그래스 링 설정
const strokeWidth = 8
const circleRadius = (160 - strokeWidth) / 2 // 이미지 크기에 맞춰서
const circumference = circleRadius * 2 * Math.PI
const dashOffset = computed(() => circumference * (1 - depositRate.value / 100))

// zibi 이미지 선택
const imagePath = computed(() => {
    const idx = Math.min(5, Math.floor(depositRate.value / 20))
    return [zibi0, zibi1, zibi2, zibi3, zibi4, zibi5][idx]
})

// // 초기 로드 시 계좌 정보 및 주소 fetch
// onMounted(async () => {
//     if (accountStore.isRegistered) {
//         await accountStore.fetchAccount()
//     }
// })

// 계좌 해지 핸들러
const disconnectAccount = async () => {
    try {
        await accountStore.disconnectAccount()
        showConfirmModal.value = false
    } catch (e) {
        alert('계좌 해지에 실패했습니다. 다시 시도해주세요.')
    }
}

const onConnectAccount = () => {
    router.push('/bank/select')
}
</script>
