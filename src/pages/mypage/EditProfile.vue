<template>
    <div class="flex flex-col items-center min-h-screen bg-white text-center px-6">
        <BackHeader title="프로필 수정" />

        <form @submit.prevent="saveProfile" class="m-4 p-2 mt-16 w-full">
            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">이름</label>
                <input
                    type="text"
                    v-model="profile.name"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">생년월일</label>
                <input
                    type="date"
                    v-model="profile.birthdate"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">계좌</label>
                <input
                    type="text"
                    v-model="profile.account"
                    class="w-full border rounded-[8px] px-3 py-2"
                />
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">e-mail / 아이디</label>
                <div class="email-input w-full border rounded-[8px] px-3 py-2 flex justify-between">
                    <input type="email" v-model="profile.email" />
                    <button
                        type="button"
                        @click="changeEmail"
                        class="text-gray-400 underline text-sm"
                    >
                        변경하기
                    </button>
                </div>
            </div>

            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">거주지(주민등록 상 거주지)</label>
                <div
                    class="address-input w-full border rounded-[8px] px-3 py-2 flex justify-between"
                >
                    <input type="text" v-model="profile.address" />
                    <button type="button">🔍</button>
                </div>
            </div>

            <div class="password-change mt-8 mb-8 flex justify-center ">
                <button
                    type="button"
                    @click="changePassword"
                    class="flex items-center gap-2 text-sm text-gray-600"
                >
                    <SquarePen /> 비밀번호 변경
                </button>
            </div>

            <PrimaryButton >저장</PrimaryButton>
        </form>
    </div>
</template>
<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { SquarePen } from 'lucide-vue-next'

const profile = reactive({
    name: '김제비',
    birthdate: '2001-01-01',
    account: '3333-1234-5678',
    email: 'zibi1234@gmail.com',
    address: '경기도 용인시 수지구',
})

const changeEmail = () => {
    alert('이메일 변경 기능은 구현 예정입니다.')
}

const changePassword = () => {
    alert('비밀번호 변경 기능은 구현 예정입니다.')
}

const saveProfile = () => {
    alert('저장되었습니다!')
}
</script>
