<template>
    <!-- 상단 타이틀 -->
    <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
        <User class="w-4 h-4 text-purple-500" />
        <span class="text-extrabold">나의 순위</span>
    </div>
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
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import rankApi from '@/api/rankApi'
import { User } from 'lucide-vue-next'

const isCalculated = ref(false)
const rankData = ref([])

const route = useRoute()
const pblancNo = route.params.id

async function calculateRank() {
    try {
        const res = await rankApi.getRankByArea(pblancNo)
        const raw = res.data.rankByArea

        // 객체를 배열로 변환
        rankData.value = Object.entries(raw).map(([area, rank]) => ({
            area, // "85 이하"
            rank_name: rank, // "1순위"
        }))

        isCalculated.value = true
    } catch (err) {
        console.error(err)
    }
}

function resetRank() {
    isCalculated.value = false
    rankData.value = []
}
</script>
