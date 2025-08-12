<template>
    <div>
        <!-- 상단 타이틀 -->
        <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
            <Smile class="w-4 h-4 text-gray-500" />
            <span>나의 당첨 가능성</span>
        </div>

        <!-- 계산 완료 -->
        <div
            v-if="isCalculated"
            class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-4"
        >
            <div>
                <p class="text-sm text-gray-800">
                    <span class="text-base font-bold">{{ subscription.title }}</span>
                    청약에 대한 나의 당첨 가능성은
                </p>
                <p :class="resultTextClass" class="text-base font-extrabold mt-1">
                    {{ resultText }}
                </p>
                <p class="text-xs text-gray-500 mt-1" v-if="probabilityPct !== null">
                    예측 확률 약 <span class="font-semibold">{{ probabilityPct }}%</span>
                </p>
                <p class="text-[11px] text-gray-400 mt-1">
                    {{ resultSubText }}
                </p>
            </div>

            <!-- 정보 박스 -->
            <div class="bg-white rounded-lg p-3 border text-left text-sm text-gray-700 space-y-1">
                <div class="flex items-start gap-2">
                    <Check class="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                        <p class="font-medium">당첨 가능성 예측에 사용된 정보</p>
                        <ul class="list-disc ml-5 mt-1 space-y-0.5 text-gray-600 text-xs">
                            <li>해당 청약의 공급 세대수</li>
                            <li>나의 순위</li>
                            <li>나의 가점</li>
                            <li>예측 지원자수</li>
                        </ul>
                    </div>
                </div>
            </div>

            <button
                @click="resetCalc"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md"
            >
                당첨 가능성 다시 확인하기
            </button>
        </div>

        <!-- 계산 전 -->
        <div v-else class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div class="text-2xl mb-2">🧑‍🏫</div>
            <p class="text-sm font-semibold text-gray-800 mb-1">당첨 가능성을 알아볼까요?</p>
            <p class="text-xs text-gray-500 leading-relaxed mb-3">
                해당 청약에 관심이 있으시군요!<br />
                지비가 회원님의 청약 당첨 가능성을 알려드려요.
            </p>

            <p v-if="errorMsg" class="text-xs text-red-500 mb-3">{{ errorMsg }}</p>

            <button
                @click="handleCalculateClick"
                :disabled="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-1"
            >
                <Sparkles class="w-4 h-4" />
                <span v-if="!loading">당첨 가능성 확인하기</span>
                <span v-else>계산 중...</span>
            </button>
        </div>

        <!-- ✅ 조건 유도 모달 -->
        <CommonModal v-if="showModal" @close="showModal = false">
            <template #title>당첨 가능성 확인 전 확인 필요</template>
            <template #default>
                <p class="text-sm text-gray-700 mb-4">
                    당첨 가능성을 예측하려면 아래 항목을 먼저 완료해야 해요.
                </p>
                <ul class="text-sm text-gray-800 mb-4 list-disc list-inside space-y-1">
                    <li v-if="!isAccountReady">✔ 계좌 등록</li>
                    <li v-if="!isScoreReady">✔ 가점 계산</li>
                </ul>
                <div class="flex gap-2">
                    <button
                        v-if="!isAccountReady"
                        @click="goToAccount"
                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md"
                    >
                        계좌 등록하기
                    </button>
                    <button
                        v-if="!isScoreReady"
                        @click="goToScore"
                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md"
                    >
                        가점 계산하기
                    </button>
                </div>
            </template>
        </CommonModal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Smile, Sparkles, Check } from 'lucide-vue-next'
import possibilityApi from '@/api/possibilityApi'
import CommonModal from '@/components/modal/CommonModal.vue'

// 조건 확인용 store
import { useScoreStore } from '@/stores/scoreStore'
import { useAccountStore } from '@/stores/account'

const props = defineProps({
    // 청약 공고번호 (예: "2025000311")
    pblancNo: { type: String, required: true },
    // 카드 제목에 쓸 단지명
    title: { type: String, default: '청약' },
    // ✅ 상세에서 내려주는 주택형(예: '아파트' | '오피스텔')
    houseType: { type: String, default: '아파트' },
})

const router = useRouter()
const scoreStore = useScoreStore()
const accountStore = useAccountStore()

const isCalculated = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const probabilityPct = ref(null) // 0~100 (%)
const resultLevel = ref(null) // 'very_low' | 'low' | 'medium' | 'high'
const showModal = ref(false)

const isAccountReady = computed(() => accountStore.isRegistered)
const isScoreReady = computed(() => scoreStore.isCalculated)
const subscription = computed(() => ({ title: props.title }))

// ✅ 엔드포인트용 타입 매핑
const endpointType = computed(() => {
    const t = (props.houseType || '').toLowerCase()
    return t.includes('오피스텔') || t.includes('officetel') ? 'officetel' : 'apt'
})

function handleCalculateClick() {
    // ❗ 조건 미충족 시 모달로 유도
    if (!isAccountReady.value || !isScoreReady.value) {
        showModal.value = true
        return
    }
    calculate()
}

async function calculate() {
    loading.value = true
    errorMsg.value = ''
    try {
        // ✅ 주택형에 맞춰 호출
        const { data } = await possibilityApi.getProbability(props.pblancNo, endpointType.value)

        // 확률 파싱
        const raw = data?.probability
        if (raw == null) {
            throw new Error('확률 필드가 응답에 없습니다.')
        }
        let p = Number(raw)
        if (Number.isNaN(p)) throw new Error('잘못된 확률 형식')

        if (p <= 1) p = p * 100
        p = Math.max(0, Math.min(100, p))
        probabilityPct.value = Math.round(p * 10) / 10

        if (p < 20) resultLevel.value = 'very_low'
        else if (p < 40) resultLevel.value = 'low'
        else if (p < 70) resultLevel.value = 'medium'
        else resultLevel.value = 'high'

        isCalculated.value = true
    } catch (e) {
        console.error('[확률 예측 실패]', e)
        const serverMsg = e.response?.data?.message || e.response?.data?.error || ''
        errorMsg.value = serverMsg || '예측 요청에 실패했습니다. 잠시 후 다시 시도해주세요.'
    } finally {
        loading.value = false
    }
}

function resetCalc() {
    isCalculated.value = false
    probabilityPct.value = null
    resultLevel.value = null
    errorMsg.value = ''
}

// 텍스트/색상 매핑
const resultText = computed(() => {
    switch (resultLevel.value) {
        case 'very_low':
            return '당첨 가능성 매우 낮음'
        case 'low':
            return '당첨 가능성 낮음'
        case 'medium':
            return '당첨 가능성 보통'
        case 'high':
            return '당첨 가능성 높음'
        default:
            return ''
    }
})

const resultTextClass = computed(() => {
    switch (resultLevel.value) {
        case 'very_low':
            return 'text-red-500'
        case 'low':
            return 'text-orange-500'
        case 'medium':
            return 'text-yellow-500'
        case 'high':
            return 'text-green-600'
        default:
            return ''
    }
})

const resultSubText = computed(() => {
    switch (resultLevel.value) {
        case 'very_low':
            return '예측 당첨 확률이 20% 미만으로 낮습니다. 다른 청약도 함께 고려해보세요.'
        case 'low':
            return '당첨 확률이 낮습니다. 다른 청약도 함께 고려해보세요.'
        case 'medium':
            return '경쟁률이 평균적입니다. 도전해볼만 해요!'
        case 'high':
            return '당첨 확률이 높은 편이에요! 기대해보셔도 좋아요!'
        default:
            return ''
    }
})

// 모달 내 이동
function goToAccount() {
    router.push('/bank/select')
}
function goToScore() {
    router.push('/score/step1')
}
</script>
