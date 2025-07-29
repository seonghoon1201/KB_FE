<!-- FAQ(공지사항) 페이지 -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
        <BackHeader title="FAQ" />
        <main
            class="fixed top-0 left-0 w-full px-1 py-6 space-y-6 pt-[70px] pb-[70px] flex flex-col inset-0"
        >
            <div class="flex mt-4">
                <button
                    :class="[
                        'w-[70px] h-10 border border-gray-300 rounded-full ml-4',
                        filter === 'all' && 'bg-blue-500 font-bold text-white',
                    ]"
                    @click="filterChange('all')"
                >
                    전체
                </button>
                <button
                    :class="[
                        'w-[70px] h-10  border border-gray-300 rounded-full ml-4',
                        filter === 'notice' && 'bg-blue-500 font-bold text-white',
                    ]"
                    @click="filterChange('notice')"
                >
                    공지
                </button>
                <button
                    :class="[
                        'w-[70px] h-10  border border-gray-300 rounded-full ml-4',
                        filter === 'event' && 'bg-blue-500 font-bold text-white',
                    ]"
                    @click="filterChange('event')"
                >
                    이벤트
                </button>
                <button
                    :class="[
                        'w-[70px] h-10  border border-gray-300 rounded-full ml-4',
                        filter === 'event' && 'bg-blue-500 font-bold text-white',
                    ]"
                    @click="filterChange('info')"
                >
                    정보
                </button>
            </div>
            <div class="w-full flex flex-col items-center overflow-scroll">
                <div
                    v-for="({ id, title, kind }, index) in tempArr"
                    :key="index"
                    @click="moveNoticeDetail(id)"
                    class="w-[95%] flex justify-between items-center mb-3"
                >
                    <div class="flex items-center p-3 box-sizing">
                        <Flag v-if="kind === 'notice'" stroke-width="1" size="36" class="mr-4" />
                        <Calendar
                            v-else-if="kind === 'event'"
                            stroke-width="1"
                            size="36"
                            class="mr-4"
                        />
                        <Circle v-else stroke-width="1" size="36" class="mr-4" />
                        <p class="text-lg">{{ title }}</p>
                    </div>
                    <ChevronRight />
                </div>
            </div>
        </main>
        <BottomNavbar />
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Circle, Flag, Calendar, ChevronRight, Info } from 'lucide-vue-next'

import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'

const router = useRouter()

const originArr = ref([])
const filter = ref('all')

// 예제용 데이터 채우기
for (let i = 0; i < 10; i++) {
    originArr.value.push({
        id: i,
        title: `test title - ${i}`,
        content: `test content - ${i} \n`,
        kind: i < 5 ? 'notice' : 'event',
    })
}

// computed로 필터링된 배열을 자동 관리
const tempArr = computed(() => {
    if (filter.value === 'all') {
        return originArr.value
    }
    return originArr.value.filter((item) => item.kind === filter.value)
})

// 버튼 클릭 시 호출
const filterChange = (value) => {
    filter.value = value
}

const moveNoticeDetail = (id) => {
    router.push(`/mypage/notice/${id}`)
}
</script>
