<template>
    <!-- 상단 타이틀 -->
    <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
        <User class="w-4 h-4 text-purple-500" />
        <span class="text-extrabold">나의 순위</span>
    </div>

    <!-- 계산된 상태 -->
    <div
        v-if="isCalculated"
        class="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center space-y-6"
    >
        <div class="grid grid-cols-2 gap-4">
            <div
                v-for="(rank, index) in rankData"
                :key="index"
                class="bg-white rounded-lg shadow-sm border border-gray-200 py-4 px-3"
            >
                <p class="text-sm text-gray-500 mb-1">전용면적 {{ rank.area }}</p>
                <p class="text-xl font-extrabold text-purple-600">{{ rank.rank_name }}</p>
            </div>
        </div>

        <button
            @click="resetRank"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-md"
        >
            순위 다시 계산하기
        </button>
    </div>

    <!-- 계산 전 상태 -->
    <div v-else class="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
        <div class="text-2xl mb-2">🤔</div>
        <p class="text-sm font-semibold text-gray-800 mb-1">청약 순위를 계산해보세요!</p>
        <p class="text-xs text-gray-500 leading-relaxed mb-4">
            주택 소유 현황, 혼인 상태, 부양가족 수 등을 입력하면 <br />
            청약 순위를 정확히 계산해드려요
        </p>
        <button
            @click="calculateRank"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-md"
        >
            👤 순위 계산하기
        </button>
    </div>

    <!-- 안내 모달 -->
    <CommonModal v-if="showModal" @close="showModal = false">
        <template #title>순위 계산 전 확인 필요</template>
        <template #default>
            <p class="text-sm text-gray-700 mb-4">
                청약 순위를 계산하려면 아래 항목을 먼저 완료해야 해요.
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User } from 'lucide-vue-next'
import { useScoreStore } from '@/stores/scoreStore'
import { useAccountStore } from '@/stores/account'
import rankApi from '@/api/rankApi'
import CommonModal from '@/components/modal/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const pblancNo = route.params.id

const scoreStore = useScoreStore()
const accountStore = useAccountStore()

const isCalculated = ref(false)
const rankData = ref([])

const showModal = ref(false)

// 조건 확인용 computed
const isAccountReady = computed(() => accountStore.isRegistered)
const isScoreReady = computed(() => scoreStore.isCalculated)

async function calculateRank() {
    // 조건 불충족 시 모달 띄움
    if (!isAccountReady.value || !isScoreReady.value) {
        showModal.value = true
        return
    }

    try {
        const res = await rankApi.getRankByArea(pblancNo)
        const raw = res.data.rankByArea

        rankData.value = Object.entries(raw).map(([area, rank]) => ({
            area,
            rank_name: rank,
        }))

        isCalculated.value = true
    } catch (err) {
        console.error('[순위 계산 실패]', err)
    }
}

function resetRank() {
    isCalculated.value = false
    rankData.value = []
}

// 모달 내 이동 버튼
function goToAccount() {
    router.push('/bank/select')
}
function goToScore() {
    router.push('/score/step1')
}
</script>
