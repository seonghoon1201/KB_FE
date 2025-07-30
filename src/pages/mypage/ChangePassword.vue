<template>
    <div class="flex flex-col items-center min-h-screen bg-white text-center px-6">
        <BackHeader title="비밀번호 변경" />

        <form @submit.prevent="savePassword" class="m-4 p-2 mt-16 w-full max-w-md">
            <!-- 현재 비밀번호 -->
            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">현재 비밀번호</label>
                <input
                    type="password"
                    v-model="currentPassword"
                    class="w-full border rounded-[8px] px-3 py-2"
                    placeholder="현재 비밀번호 입력"
                    :disabled="saving"
                />
            </div>

            <!-- 새 비밀번호 -->
            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">새 비밀번호</label>
                <input
                    type="password"
                    v-model="newPassword"
                    class="w-full border rounded-[8px] px-3 py-2"
                    placeholder="영문, 숫자 포함 8자리 이상"
                    :disabled="saving"
                />
                <p v-if="newPassword && !isNewPasswordValid" class="text-red-500 text-sm mt-1">
                    비밀번호는 영문과 숫자를 모두 포함하여 8자리 이상이어야 합니다.
                </p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="mb-4 text-left w-full">
                <label class="block font-semibold mb-1 text-[14px]">비밀번호 확인</label>
                <input
                    type="password"
                    v-model="confirmPassword"
                    class="w-full border rounded-[8px] px-3 py-2"
                    placeholder="비밀번호 확인"
                    :disabled="saving"
                />
                <p v-if="confirmPassword && !isMatch" class="text-red-500 text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                </p>
            </div>

            <!-- 완료 버튼 -->
            <PrimaryButton
                type="submit"
                class="w-full py-2.5 rounded-[8px]"
                :disabled="saving || !canSubmit"
            >
                {{ saving ? '변경 중…' : '완료' }}
            </PrimaryButton>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackHeader from '@/components/common/BackHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import authApi from '@/api/authApi'

const router = useRouter()

// form state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)

// 영문+숫자 포함 8자리 이상
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const isNewPasswordValid = computed(() => pwRegex.test(newPassword.value))
const isMatch = computed(() => newPassword.value === confirmPassword.value)

// 제출 버튼 활성화 여부
const canSubmit = computed(
    () =>
        currentPassword.value &&
        newPassword.value &&
        confirmPassword.value &&
        isNewPasswordValid.value &&
        isMatch.value,
)

async function savePassword() {
    if (!canSubmit.value) {
        alert('입력 항목을 다시 확인해주세요.')
        return
    }
    saving.value = true
    try {
        await authApi.changepassword({
            old_password: currentPassword.value,
            new_password: newPassword.value,
        })
        alert('비밀번호가 성공적으로 변경되었습니다.')
        router.push('/mypage')
    } catch (err) {
        console.error('비밀번호 변경 에러:', err)
        alert(err.response?.data || '비밀번호 변경에 실패했습니다.')
    } finally {
        saving.value = false
    }
}
</script>
