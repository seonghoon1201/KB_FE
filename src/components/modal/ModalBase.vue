<!-- 모달 컴포넌트 -->
<template>
    <div class="w-full h-full" v-show="modalStore.modal">
        <div class="fixed top-0 left-0 w-[40%] h-screen z-50" @click="modalStore.modalClose"></div>
        <div
            class="fixed top-0 right-0 w-[60%] h-screen bg-white border-l-2 border-gray-300 z-50"
            @mousedown="dragStart"
        >
            <div class="h-[15%] p-1 border-b-2">
                <X class="box-border" @click="modalStore.modalOnOff" />
                <div class="m-2 mt-3 flex justify-between items-center">
                    <div>
                        <p class="text-sm">
                            안녕하세요,
                            <strong>{{ username }}</strong>
                            님
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
            <div class="h-[55%] p-5 flex flex-col justify-between items-center">
                <div class="w-full">
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2"
                        @click="movePage('/mypage')"
                    >
                        <p class="text-sm">마이페이지</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2"
                        @click="movePage('/mypage/notice')"
                    >
                        <p class="text-sm">공지사항</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2"
                        @click="movePage('/mypage/terms')"
                    >
                        <p class="text-sm">이용약관</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2"
                        @click="movePage('/mypage/userterms')"
                    >
                        <p class="text-sm">사용자약관</p>
                        <ChevronRight />
                    </div>
                    <div
                        class="w-full h-8 mb-4 flex justify-between border-b-2"
                        @click="movePage('/login')"
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/common' // 모달창 제어 피니아
// import { useUserStore } from '@/stores/user' // 유저 정보 피니아
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

const modalStore = useCommonStore() // 모달창 제어 피니아
// const userStore = useUserStore();    // 유저 정보 피니아
const router = useRouter()

const username = '테스트테스'

const movePage = (page) => {
    modalStore.modalOnOff()
    router.push(page)
}
</script>
