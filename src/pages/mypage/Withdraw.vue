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

            <!-- 비밀번호 입력 -->
            <div class="mt-6">
                <label for="password" class="text-sm font-medium text-gray-700"
                    >비밀번호 확인</label
                >
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    class="mt-2 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <!-- 탈퇴 버튼 -->
            <button
                :disabled="!password"
                @click="isModalOpen = true"
                class="mt-6 w-full py-2.5 rounded-md text-base font-semibold text-white transition bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                탈퇴하기
            </button>
        </div>

        <!-- ✅ 확인 모달 -->
        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white w-80 rounded-lg shadow-lg p-6 text-center space-y-4">
                <p class="text-lg font-extrabold text-gray-800">정말 탈퇴하시겠습니까?</p>
                <p class="text-base text-gray-600">탈퇴 후에는 모든 정보가 삭제됩니다.</p>
                <div class="flex justify-between gap-3 mt-4">
                    <button
                        @click="isModalOpen = false"
                        class="w-full py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        @click="handleagain"
                        class="w-full py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
        <div
            v-if="isRealModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white w-80 rounded-lg shadow-lg p-6 text-center space-y-4">
                <p class="text-lg font-extrabold text-gray-800">찐막 탈퇴할 거임?</p>
                <p class="text-base text-gray-600">후회할텐데?</p>
                <div class="flex justify-between gap-3 mt-4">
                    <button
                        @click="isRealModalOpen = false"
                        class="w-full py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        @click="handleWithdraw"
                        class="w-full py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { HeartHandshake, FileWarning, FlagOff, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const password = ref('')
const isModalOpen = ref(false)
const isRealModalOpen = ref(false)
const router = useRouter()

const handleagain = () => {
    isModalOpen.value = false
    isRealModalOpen.value = true
}

const handleWithdraw = () => {
    isModalOpen.value = false
    // ✅ 실제 탈퇴 처리 로직 (백엔드 연동 예정)
    alert('회원 탈퇴 처리가 완료되었습니다.')
    router.push('/login')
}
</script>
