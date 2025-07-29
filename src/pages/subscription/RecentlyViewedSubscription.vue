<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <BackHeader title="최근 본 공고" />

        <div class="flex-1 px-4 py-6 pb-20">
            <div class="text-center py-20 text-gray-500">
                최근 본 청약 공고가 없습니다.
            </div>

        </div>

        <BottomNavbar />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'
import SubscriptionCard from '@/components/subscription/SubscriptionCard.vue'

</script>
