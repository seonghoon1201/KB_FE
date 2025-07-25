<!-- FAQ(공지사항) 페이지 -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
        <BackHeader title="FAQ" />
        <main
            class="fixed top-0 left-0 w-full px-1 py-6 space-y-6 pt-[70px] pb-[70px] flex flex-col inset-0"
        >
            <div class="flex mt-4">
                <button
                    class="w-[70px] h-10 border border-gray-300 rounded-full ml-4"
                    v-show="tempArr.kind === 'notice'"
                >
                    공지
                </button>
                <button
                    class="w-[70px] h-10 border border-gray-300 rounded-full ml-4"
                    v-show="tempArr.kind === 'event'"
                >
                    이벤트
                </button>
            </div>
            <div class="w-full flex flex-col items-center overflow-scroll">
                <div
                    class="w-[95%] flex justify-between items-center mb-3 border-b border-gray-200"
                >
                    <div class="flex items-center p-3 box-sizing">
                        <Flag
                            v-if="tempArr.kind === 'notice'"
                            stroke-width="1"
                            size="36"
                            class="mr-4"
                        />
                        <Calendar
                            v-else-if="tempArr.kind === 'event'"
                            stroke-width="1"
                            size="36"
                            class="mr-4"
                        />
                        <Circle v-else stroke-width="1" size="36" class="mr-4" />
                        <p class="text-lg">{{ tempArr.title }}</p>
                    </div>
                    <p class="text-sm text-gray-400">2025-07-21</p>
                </div>
                <div class="w-[95%] mb-3 p-3 border-b border-gray-200">
                    <p class="text-left text-md">{{ tempArr.content }}</p>
                    <p class="text-left text-md">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus
                        quidem iusto a sunt autem voluptates, doloremque laborum possimus odit! Ipsa
                        officia eveniet debitis magni obcaecati molestiae inventore voluptatum esse
                        ad.
                    </p>
                </div>
            </div>
        </main>
        <BottomNavbar />
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Circle,
    Flag,
    MessageCircleWarning,
    MessageSquareWarning,
    CircleAlert,
    Calendar,
    ChevronRight,
} from 'lucide-vue-next'

import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavbar from '@/components/common/BottomNavbar.vue'

const route = useRoute()
const originArr = ref([])

// 예제용 데이터 채우기
for (let i = 0; i < 10; i++) {
    originArr.value.push({
        id: i + '',
        title: `test title - ${i}`,
        content: `test content - ${i} \n`,
        kind: i < 5 ? 'notice' : 'event',
    })
}

const tempArr = computed(() => {
    return originArr.value.filter((item) => item.id === route.params.id)[0]
})
</script>
