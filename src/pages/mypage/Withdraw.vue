<template>
    <div class="min-h-screen bg-white px-4 pt-20 pb-10">
        <!-- 상단 헤더 -->
        <BackHeader title="회원 탈퇴" />

        <!-- 안내 박스 -->
        <div class="mt-6 space-y-4">
            <p class="text-xl font-extrabold text-gray-900">주의하세요!</p>
            <p class="text-base text-gray-700">회원 탈퇴 시 다음과 같은 정보들이 삭제됩니다.</p>

            <!-- 삭제 정보 리스트 -->
            <div
                class="bg-[#F8FBFD] border border-gray-200 rounded-lg px-4 py-3 space-y-2 text-base text-gray-800"
            >
                <div class="flex items-center gap-2">
                    <HeartHandshake class="w-4 h-4 text-blue-400" />
                    <span>나의 선호 지역, 평수 정보</span>
                </div>
                <div class="flex items-center gap-2">
                    <FileWarning class="w-4 h-4 text-blue-400" />
                    <span>연결된 청약 통장, 예치금 정보</span>
                </div>
                <div class="flex items-center gap-2">
                    <FlagOff class="w-4 h-4 text-blue-400" />
                    <span>즐겨찾기한 청약 공고</span>
                </div>
                <div class="flex items-center gap-2">
                    <User class="w-4 h-4 text-blue-400" />
                    <span>나의 가점 정보</span>
                </div>
            </div>

            <!-- 경고 문구 -->
            <p class="text-sm text-red-500 font-bold">
                삭제된 정보는 복구할 수 없으니 신중하게 결정해주세요.
            </p>

            <!-- 탈퇴 버튼 -->
            <button
                type="button"
                @click="isModalOpen = true"
                class="mt-6 w-full py-2.5 rounded-md text-base font-semibold text-white transition bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {{ sending ? '처리중…' : '탈퇴하기' }}
            </button>
        </div>

        <!-- 첫 번째 확인 모달 -->
        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white w-80 rounded-lg shadow-lg p-6 text-center space-y-4">
                <p class="text-lg font-extrabold text-gray-800">정말 탈퇴하시겠습니까?</p>
                <p class="text-base text-gray-600">탈퇴 후에는 모든 정보가 삭제됩니다.</p>
                <div class="flex justify-between gap-3 mt-4">
                    <button
                        type="button"
                        @click="isModalOpen = false"
                        class="w-full py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        @click="handleAgain"
                        class="w-full py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>

        <!-- 최종 탈퇴 모달 -->
        <div
            v-if="isRealModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white w-80 rounded-lg shadow-lg p-6 text-center space-y-4">
                <p class="text-lg font-extrabold text-gray-800">찐막 탈퇴할 거임?</p>
                <p class="text-base text-gray-600">후회할텐데?</p>
                <div class="flex justify-between gap-3 mt-4">
                    <button
                        type="button"
                        @click="isRealModalOpen = false"
                        class="w-full py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        @click="handleWithdraw"
                        :disabled="sending"
                        class="w-full py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                    >
                        {{ sending ? '탈퇴중…' : '확인' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '@/api/authApi'
import { useUserStore } from '@/stores/user'
import BackHeader from '@/components/common/BackHeader.vue'

const isModalOpen = ref(false)
const isRealModalOpen = ref(false)
const sending = ref(false)

const router = useRouter()
const userStore = useUserStore()

function handleAgain() {
    isModalOpen.value = false
    isRealModalOpen.value = true
}

async function handleWithdraw() {
    if (sending.value) return

    sending.value = true
    try {
        // 1) 회원탈퇴 API 호출 (DELETE /auth/signout)
        await authApi.signout()

        // 2) 로컬 스토어 초기화 (토큰, 유저정보 삭제)
        await userStore.signout()

        alert('회원 탈퇴가 완료되었습니다.')
        router.replace('/login')
    } catch (err) {
        console.error('회원탈퇴 에러:', err)
        const msg = err.response?.data
        alert(typeof msg === 'string' ? msg : msg?.message || '회원탈퇴에 실패했습니다.')
    } finally {
        sending.value = false
        isRealModalOpen.value = false
    }
}
</script>
