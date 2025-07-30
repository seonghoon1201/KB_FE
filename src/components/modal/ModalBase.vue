<template>
    <div class="w-full h-full" v-show="modalStore.modal">
        <!-- 백드롭 -->
        <div class="fixed top-0 left-0 w-[40%] h-screen z-50" @click="modalStore.modalClose"></div>

        <!-- 사이드바 -->
        <div
            class="fixed top-0 right-0 w-[60%] h-screen bg-white border-l-2 border-gray-300 z-50"
            @mousedown="dragStart"
        >
            <!-- 상단 프로필 영역 -->
            <div class="h-[15%] p-1 border-b-2">
                <X class="box-border" @click="modalStore.modalOnOff" />
                <div class="m-2 mt-3 flex justify-between items-center">
                    <div>
                        <p class="text-sm">
                            안녕하세요, <strong>{{ username }}</strong> 님
                        </p>
                        <div class="flex flex-row items-center" @click="movePage('/mypage/edit')">
                            <p class="text-sm text-gray-500 mr-1">프로필 편집</p>
                            <ChevronRight color="gray" size="14px" />
                        </div>
                    </div>
                    <div
                        class="border-2 border-black rounded-full w-30 h-30 flex items-center justify-center"
                    >
                        <User size="30" />
                    </div>
                </div>
            </div>

            <!-- 빠른 링크 섹션 -->
            <div class="h-[25%] pt-4 pb-4 flex flex-col justify-around p-1 border-b-2">
                <div class="flex justify-start">
                    <div
                        class="w-[30%] flex flex-col items-center mr-3"
                        @click="movePage('/score/result')"
                    >
                        <Calculator stroke-width="1.5" size="36" />
                        <p class="text-sm">가점</p>
                        <p class="text-sm">확인하기</p>
                    </div>
                    <div
                        class="w-[30%] flex flex-col items-center mr-3"
                        @click="movePage('/subscriptions')"
                    >
                        <ClipboardList stroke-width="1.5" size="36" />
                        <p class="text-sm">청약정보</p>
                    </div>
                    <div class="w-[30%] flex flex-col items-center" @click="movePage('/favorites')">
                        <Heart stroke-width="1.5" size="36" />
                        <p class="text-sm">즐겨찾기</p>
                    </div>
                </div>
                <div class="flex justify-start">
                    <div class="w-[30%] flex flex-col items-center mr-3" @click="movePage('/map')">
                        <Map stroke-width="1.5" size="36" />
                        <p class="text-sm">지도</p>
                    </div>
                    <div
                        class="w-[30%] flex flex-col items-center mr-3"
                        @click="movePage('/calendar')"
                    >
                        <Calendar stroke-width="1.5" size="36" />
                        <p class="text-sm">달력</p>
                    </div>
                    <div class="w-[30%] flex flex-col items-center"></div>
                </div>
            </div>

            <!-- 메뉴 리스트 -->
            <div class="h-[55%] p-5 flex flex-col justify-between items-center">
                <div class="w-full">
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2 cursor-pointer"
                        @click="movePage('/mypage')"
                    >
                        <p class="text-sm">마이페이지</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2 cursor-pointer"
                        @click="movePage('/mypage/notice')"
                    >
                        <p class="text-sm">공지사항</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2 cursor-pointer"
                        @click="movePage('/mypage/terms')"
                    >
                        <p class="text-sm">이용약관</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2 cursor-pointer"
                        @click="movePage('/mypage/userterms')"
                    >
                        <p class="text-sm">사용자약관</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2 cursor-pointer"
                        @click="handleLogout"
                    >
                        <p class="text-sm">로그아웃</p>
                        <ChevronRight />
                    </div>
                </div>
                <div
                    class="w-full h-8 mb-4 flex justify-between border-red-500 border-b-2"
                    @click="movePage('/mypage/withdraw')"
                >
                    <p class="text-sm text-red-600 font-bold">회원탈퇴</p>
                    <ChevronRight color="red" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import authApi from '@/api/authApi'
import {
    X,
    User,
    ChevronRight,
    Calculator,
    ClipboardList,
    Heart,
    Map,
    Calendar,
} from 'lucide-vue-next'

const router = useRouter()
const modalStore = useCommonStore()
const userStore = useUserStore()

// 실제 로그인된 사용자의 이름을 Pinia store에서 가져옵니다.
const username = computed(() => userStore.name || '손님')

// 페이지 이동 헬퍼
function movePage(path) {
    modalStore.modalOnOff()
    router.push(path)
}

// 로그아웃 처리
async function handleLogout() {
    try {
        // 백엔드 세션/토큰 만료 요청
        await authApi.logout()
    } catch (e) {
        console.warn('로그아웃 API 에러:', e)
    }
    // Pinia 유저 정보 클리어
    userStore.logout()

    // 모달 닫고 로그인 페이지로 이동
    modalStore.modalOnOff()
    router.replace('/login')
}
</script>
