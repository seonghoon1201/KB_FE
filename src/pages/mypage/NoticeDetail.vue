<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
        <BackHeader title="FAQ" />

        <main class="pt-[70px] pb-[80px] w-full max-w-md mx-auto">
            <div
                v-for="({ id, title, content, kind }, index) in tempArr"
                :key="id"
                class="w-full mb-1 border-b"
            >
                <!-- 질문 영역 -->
                <div
                    class="flex justify-between items-center px-4 py-3 cursor-pointer"
                    @click="toggleDetail(id)"
                >
                    <div class="flex items-center">
                        <Flag v-if="kind === 'notice'" stroke-width="1" size="20" class="mr-2" />
                        <Calendar
                            v-else-if="kind === 'event'"
                            stroke-width="1"
                            size="20"
                            class="mr-2"
                        />
                        <Circle v-else stroke-width="1" size="20" class="mr-2" />
                        <p class="text-sm font-medium text-left">{{ title }}</p>
                    </div>
                    <ChevronRight :class="[isOpen(id) ? 'rotate-90' : '', 'transition']" />
                </div>

                <!-- 답변 영역 -->
                <transition name="slide">
                    <div
                        v-show="isOpen(id)"
                        class="px-6 pb-4 text-left text-xs text-gray-600 leading-snug whitespace-pre-line"
                    >
                        {{ content }}
                    </div>
                </transition>
            </div>
        </main>

        <BottomNavbar />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Circle, Flag, Calendar, ChevronRight } from 'lucide-vue-next'

import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'

const router = useRouter()

const originArr = ref([
    {
        id: 1,
        title: '청약가점제란 무엇인가요?',
        content: `- 청약 신청자의 3가지 조건에 따라 가산점을 부여하여 분양 주택의 당첨자를 결정하는 제도를 말합니다.
- 청약 가점은 부양 가족수 5~35점, 무주택 기간 2~32점, 청약 통장 가입 기간 1~17점으로 최고 점수는 84점입니다.
- 부양 가족수는 1명당 5점씩, 무주택 기간은 1년마다 2점씩, 청약 통장 가입은 1년마다 1점씩 올라가는 방식입니다.`,
        kind: 'notice',
    },
    {
        id: 2,
        title: '무주택기간은 어떻게 산정하나요?',
        content: `- 무주택 기간은 청약 신청자 본인 및 배우자를 기준으로 계산합니다.
• 혼인 신고일 : 혼인신고서 제출한 날
• 무주택자가 된 날 : 건물 등기부등본 등기 접수일`,
        kind: 'notice',
    },
])

const filter = ref('all')

// 필터링된 데이터 반환
const tempArr = computed(() => {
    if (filter.value === 'all') return originArr.value
    return originArr.value.filter((item) => item.kind === filter.value)
})

// 펼쳐질 항목 ID
const openedId = ref(null)
const toggleDetail = (id) => {
    openedId.value = openedId.value === id ? null : id
}
const isOpen = (id) => openedId.value === id
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
}
.slide-enter-to,
.slide-leave-from {
    max-height: 500px;
    opacity: 1;
    padding-top: 0.25rem;
}
</style>
