<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <BackHeader title="최근 본 공고" />
        <!-- 공고 목록 -->
        <div class="flex-1 px-4 py-4 pb-20">
            <div v-if="recentSubscriptions.length === 0" class="text-center py-12">
                <p class="text-gray-500">현재 표시할 청약 공고가 없습니다.</p>
            </div>
            <!-- 공고 리스트: SubscriptionCard 컴포넌트 반복 -->
            <div v-else class="space-y-4">
                <SubscriptionCard
                    v-for="subscription in recentSubscriptions"
                    :key="subscription.pblanc_no"
                    :subscription="subscription"
                />
            </div>
        </div>
        <BottomNavbar />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'
import recentApi from '@/api/recentApi'

const recentSubscriptions = ref([])

onMounted(async () => {
    recentSubscriptions.value = await recentApi.getRecentView()
    console.log('data : ', recentSubscriptions.value)
})
</script>
