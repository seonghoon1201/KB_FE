<template>
    <div class="flex flex-col items-center min-h-screen bg-white text-center px-6">
        <BackHeader title="프로필 수정" />

        <form @submit.prevent="saveProfile" class="m-4 p-2 mt-16 w-full">
            <div class="mb-2 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">e-mail / 아이디</label>
                <div
                    class="email-input w-full border rounded-[8px] px-3 py-2 flex justify-between bg-gray-100"
                >
                    <input
                        type="email"
                        v-model="profile.email"
                        readonly
                        class="bg-gray-100 cursor-not-allowed w-full focus:outline-none"
                    />
                </div>
            </div>

            <div class="mb-2 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">계좌</label>
                <input
                    type="text"
                    v-model="profile.account"
                    class="w-full border rounded-[8px] px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
                    readonly
                />
            </div>

            <div class="mb-2 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">이름</label>
                <input
                    type="text"
                    v-model="profile.name"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <div class="mb-2 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">생년월일</label>
                <input
                    type="date"
                    v-model="profile.birthdate"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <div class="mb-2 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">
                    거주지(주민등록 상 거주지)
                </label>
                <div class="relative w-full">
                    <input
                        v-model="profile.address"
                        type="text"
                        class="w-full border rounded-[8px] px-3 py-2 pr-10 bg-white"
                        readonly
                    />
                    <button
                        type="button"
                        @click="searchAddress"
                        class="absolute top-1/2 right-1 -translate-y-1/2 flex items-center justify-center w-12 h-12 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="password-change mt-8 mb-8 flex justify-center">
                <button
                    type="button"
                    @click="navigateTo('/mypage/changepw')"
                    class="flex items-center gap-2 text-sm text-gray-600"
                >
                    <SquarePen /> 비밀번호 변경
                </button>
            </div>

            <PrimaryButton>저장</PrimaryButton>
        </form>
    </div>
</template>
<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { SquarePen, Search } from 'lucide-vue-next'

const router = useRouter()
const showAddressModal = ref(false)
const address = ref('')

const profile = reactive({
    name: '김제비',
    birthdate: '2001-01-01',
    account: '3333-1234-5678',
    email: 'zibi1234@gmail.com',
    address: '경기도 용인시 수지구',
})

const searchAddress = () => {
    new window.daum.Postcode({
        oncomplete: function (data) {
            profile.address = data.address // ✅ 여기에 직접 넣어야 함!
        },
    }).open()
}

const saveProfile = () => {
    // 프로필 저장 구현
    alert('저장되었습니다!')
}
const navigateTo = (path) => {
    router.push(path)
}
</script>
