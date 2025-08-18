<!-- src/components/home/RecommendSection.vue -->
<template>
    <div class="bg-white p-4 rounded-xl border shadow-sm">
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-lg font-bold">맞춤형 청약 추천</h2>
            <Cog class="w-4 h-4 text-gray-500 cursor-pointer" @click="goToPreference" />
        </div>
        <!-- 로딩: 선호/추천 둘 중 하나라도 로딩이면 스켈레톤 -->
        <div v-if="prefStore.loading || recStore.loading" class="space-y-2">
            <div class="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-16 bg-gray-100 rounded animate-pulse"></div>
        </div>

        <!-- 추천 있음 -->
        <div v-else-if="prefStore.isSet && recStore.top3.length > 0" class="space-y-3">
            <SubscriptionCard
                v-for="item in recStore.top3"
                :key="item.pblanc_no || item.house_nm"
                :subscription="item"
            />
            <button
                class="w-full mt-2 text-sm font-semibold py-2 border rounded-lg hover:bg-gray-50"
                @click="goToRecommendList"
            >
                더 보기
            </button>
        </div>

        <!-- 선호는 설정되어 있는데 리스트가 비어있음 -->
        <div v-else-if="prefStore.isSet" class="bg-[#FFF7E7] rounded-xl p-4 text-center">
            <p class="text-sm text-gray-600">
                조건에 맞는 추천이 아직 없습니다. 선호 조건을 조정해 보세요.
            </p>
            <button
                class="mt-3 w-full bg-[#F2954B] text-white py-2 text-sm rounded"
                @click="goToPreference"
            >
                선호 조건 수정
            </button>
        </div>

        <!-- 선호 미설정 -->
        <div v-else class="bg-[#FFF7E7] rounded-xl p-4 text-center flex flex-col items-center">
            <Settings class="w-10 h-10 text-gray-500 mb-2" />
            <p class="text-lg font-bold text-gray-800">선호 설정이 필요해요!</p>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                선호하는 지역과 평수를 설정하면<br />맞춤형 청약 추천을 받을 수 있어요
            </p>
            <button
                class="mt-3 w-full bg-[#F2954B] text-white py-2 text-sm rounded flex justify-center items-center gap-1"
                @click="goToPreference"
            >
                <Settings class="w-4 h-4" /> 선호 설정하기
            </button>
        </div>
    </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Cog, Settings } from 'lucide-vue-next'
import SubscriptionCard from '../subscription/SubscriptionCard.vue'
import { useRecommendationStore } from '@/stores/recommendation'
import { usePreferenceStore } from '@/stores/preference'

const router = useRouter()
const recStore = useRecommendationStore()
const prefStore = usePreferenceStore()

const goToPreference = () => router.push('/preference')
const goToRecommendList = () =>
    router.push({ path: '/subscriptions', query: { mode: 'recommend' } })

onMounted(async () => {
    // 앱 진입 시 선호 동기화 → 추천 로드
    await prefStore.hydrate()
    if (prefStore.isSet) await recStore.fetch()
})

watch(
    () => prefStore.isSet,
    async (v) => {
        if (v) await recStore.fetch()
        else recStore.clear()
    },
    { immediate: false },
)
</script>
