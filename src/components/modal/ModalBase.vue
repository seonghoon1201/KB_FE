<template>
    <div class="contents" v-bind="$attrs">
        <!-- ✅ 백드롭: 페이드 -->
        <Transition
            enter-active-class="transition-opacity duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="modalStore.modal"
                class="fixed inset-0 z-[100] bg-black/40"
                @click="modalStore.modalClose"
            />
        </Transition>

        <!-- ✅ 사이드바: 오른쪽에서 슬라이드 -->
        <Transition
            enter-active-class="transform transition-transform duration-300 ease-out"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition-transform duration-200 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
        >
            <div
                v-if="modalStore.modal"
                class="fixed top-0 right-0 z-[101] w-[60%] h-screen bg-white border-l-2 border-gray-300 will-change-transform"
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
                            <div
                                class="flex flex-row items-center"
                                @click="movePage('/mypage/edit')"
                            >
                                <p class="text-sm text-gray-500 mr-1">프로필 편집</p>
                                <ChevronRight color="gray" size="14px" />
                            </div>
                        </div>
                        <div class="gap-2">
                            <img src="@/assets/images/zibi_2.png" alt="egg" class="w-16 h-16" />
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
                        <div
                            class="w-[30%] flex flex-col items-center"
                            @click="movePage('/favorites')"
                        >
                            <Heart stroke-width="1.5" size="36" />
                            <p class="text-sm">즐겨찾기</p>
                        </div>
                    </div>
                    <div class="flex justify-start">
                        <div
                            class="w-[30%] flex flex-col items-center mr-3"
                            @click="movePage('/map')"
                        >
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
                <div class="h-[60%] p-5 flex flex-col justify-between items-center">
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
                            <p class="text-sm">FAQ</p>
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
                        class="w-full h-8 mb-4 flex justify-between border-red-500 border-b-2 cursor-pointer"
                        @click="movePage('/mypage/withdraw')"
                    >
                        <p class="text-sm text-red-600 font-bold">회원탈퇴</p>
                        <ChevronRight color="red" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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

const username = computed(() => userStore.name || '손님')

// ✅ 바디 스크롤 잠금
watch(
    () => modalStore.modal,
    (open) => {
        if (typeof window === 'undefined') return
        document.body.style.overflow = open ? 'hidden' : ''
    },
    { immediate: true },
)

// ✅ ESC 키로 닫기 (선택)
function onKeydown(e) {
    if (e.key === 'Escape' && modalStore.modal) modalStore.modalClose()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function movePage(path) {
    modalStore.modalOnOff()
    router.push(path)
}

async function handleLogout() {
    try {
        await authApi.logout()
    } catch (e) {
        console.warn('로그아웃 API 에러:', e)
    }
    userStore.logout()
    modalStore.modalOnOff()
    router.replace('/login')
}

// 기존 dragStart 있으면 유지
function dragStart() {}
</script>
