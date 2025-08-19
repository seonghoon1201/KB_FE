<template>
    <div class="flex flex-col items-center min-h-screen bg-white text-center px-6">
        <BackHeader title="마이페이지" />

        <!-- User Info Card -->
        <div
            class="bg-[#EEF8FD] rounded-xl m-4 p-4 mt-20 flex items-center justify-between w-full"
            @click="navigateTo('/mypage/edit')"
        >
            <div>
                <p class="text-lg font-bold text-left">{{ userStore.name }}님, 안녕하세요!</p>
                <p class="text-sm text-gray-600 text-left">{{ userStore.email }}</p>
            </div>
            <!-- 프로필 이미지 (흰색 배경 처리) -->
            <div class="flex flex-row items-center justify-center">
                <div
                    class="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden"
                >
                    <img
                        src="@/assets/images/zibi_4.png"
                        class="w-12 h-12 object-cover"
                        alt="프로필 이미지"
                    />
                </div>
                <ChevronRight />
            </div>
        </div>

        <!-- 메뉴 리스트 -->
        <ul class="mt-2 w-full">
            <li
                v-for="(item, index) in menuItems"
                :key="index"
                @click="navigateTo(item.route)"
                class="flex items-center justify-between px-4 py-4 border-b cursor-pointer hover:bg-gray-50 transition"
            >
                <div class="flex items-center gap-3">
                    <component :is="item.icon" class="w-5 h-5 text-gray-700" />
                    <span class="text-sm font-medium text-gray-800">{{ item.label }}</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </li>
        </ul>
    </div>
</template>

<script setup>
// 아직 구현할 기능 없음
import BackHeader from '@/components/common/BackHeader.vue'
import { useRouter } from 'vue-router'
import { ChevronRight, FileText, Heart, Calculator, MapPin } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const menuItems = [
    { label: '최근 본 공고', route: '/recent', icon: FileText },
    { label: '즐겨찾기', route: '/favorites', icon: Heart },
    { label: '가점 정보', route: '/score/result', icon: Calculator },
    { label: '선호 정보', route: '/mypage/mypreferences', icon: MapPin },
]

const navigateTo = (path) => {
    router.push(path)
}
</script>
