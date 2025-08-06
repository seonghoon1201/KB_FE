<template>
    <div class="min-h-screen bg-white px-6 py-4 overflow-y-auto">
        <!-- 상단 헤더 -->
        <div class="flex items-center mb-6 relative w-full">
            <button @click="goBack" class="absolute left-0 text-black">
                <LucideArrowLeft class="w-6 h-6" />
            </button>
            <h1 class="text-lg font-semibold text-center w-full">회원가입</h1>
        </div>

        <!-- 제목 -->
        <h2 class="text-2xl font-bold mb-6">반갑습니다!</h2>

        <!-- 폼 전체 -->
        <form @submit.prevent="submit" class="flex flex-col gap-6 pb-10">
            <!-- 이메일 -->
            <div>
                <label class="text-base font-medium block mb-2">이메일</label>
                <div class="flex gap-2 items-end">
                    <input
                        v-model="email"
                        type="email"
                        placeholder="이메일을 입력해 주세요."
                        class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
                    />
                    <!-- (1) 이메일 인증코드 전송 버튼 -->
                    <PrimaryButton
                        type="button"
                        :fullWidth="false"
                        customClass="px-4 h-[36px] text-sm"
                        :disabled="sending || !email"
                        @click="sendAuthCode"
                    >
                        {{ sending ? '전송중…' : emailSent ? '재전송' : '인증코드 전송' }}
                    </PrimaryButton>
                </div>
            </div>

            <!-- 인증코드 입력 -->
            <div>
                <label class="text-base font-medium block mb-2">인증코드 입력</label>
                <div class="flex gap-2 items-end">
                    <input
                        v-model="code"
                        type="text"
                        placeholder="인증코드를 입력해 주세요."
                        class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
                        :disabled="!emailSent || verified"
                    />
                    <!-- (2) 인증코드 확인 버튼 -->
                    <PrimaryButton
                        type="button"
                        :fullWidth="false"
                        customClass="px-4 h-[36px] text-sm"
                        :disabled="verifying || !code || verified"
                        @click="verifyAuthCode"
                    >
                        {{ verifying ? '검증중…' : verified ? '인증됨' : '인증확인' }}
                    </PrimaryButton>
                </div>
            </div>

            <!-- 비밀번호 -->
            <div>
                <label class="text-base font-medium block mb-2">비밀번호</label>
                <input
                    v-model="password"
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
                />
                <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">
                    비밀번호는 문자와 숫자를 모두 포함하여 8~20자여야 합니다.
                </p>
            </div>

            <!-- 비밀번호 확인 -->
            <div>
                <label class="text-base font-medium block mb-2">비밀번호 확인</label>
                <input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력해 주세요."
                    class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
                />
                <p v-if="confirmPassword && !isPasswordMatch" class="text-red-500 text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                </p>
            </div>

            <!-- 이름 -->
            <div>
                <label class="text-base font-medium block mb-2">이름</label>
                <input
                    v-model="name"
                    type="text"
                    placeholder="이름을 입력해 주세요."
                    class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
                />
            </div>

            <!-- 생년월일 -->
            <div>
                <label class="text-base font-medium block mb-2">생년월일</label>
                <input
                    v-model="birth"
                    type="date"
                    class="w-full border-b border-gray-300 py-2 text-base focus:outline-none"
                />
            </div>

            <!-- 주소 -->
            <div>
                <label class="text-base font-medium block mb-2">주소</label>
                <div class="flex gap-2 items-center">
                    <input
                        v-model="address"
                        type="text"
                        placeholder="우편번호 및 주소를 입력해 주세요."
                        class="flex-1 border-b border-gray-300 py-2 text-base focus:outline-none"
                        readonly
                    />
                    <button type="button" @click="searchAddress">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 text-gray-600"
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

            <!-- 약관 -->
            <div class="text-base mt-2 space-y-3">
                <label class="flex items-center gap-2 font-medium">
                    <input type="checkbox" v-model="agreeAll" @change="toggleAll" />
                    모두 동의합니다
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="terms.service" />
                    [필수] 이용약관
                    <button type="button" class="text-primary underline" @click="openTermsModal">
                        [보기]
                    </button>
                </label>
                <TermsModal :visible="showTermsModal" @close="closeTermsModal" />

                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="terms.privacy" />
                    [필수] 개인정보 수집 및 이용 동의
                    <button type="button" class="text-primary underline" @click="openPrivacyModal">
                        [보기]
                    </button>
                </label>
                <PrivacyModal :visible="showPrivacyModal" @close="closePrivacyModal" />

                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="terms.marketing" />
                    [선택] 마케팅 정보 수신 동의
                </label>
            </div>

            <!-- 가입 버튼 -->
            <PrimaryButton
                type="submit"
                :disabled="loading || !isFormValid"
                class="mt-6 w-full h-[48px] text-base font-semibold"
            >
                {{ loading ? '가입중…' : '지비 가입하기' }}
            </PrimaryButton>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as LucideArrowLeft } from 'lucide-vue-next'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import TermsModal from '@/components/modal/TermsModal.vue'
import PrivacyModal from '@/components/modal/PrivacyModal.vue'
import authApi from '@/api/authApi'

// router
const router = useRouter()
const goBack = () => router.back()

// form fields
const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const address = ref('')
const birth = ref('')

// email 인증 상태
const sending = ref(false)
const emailSent = ref(false)
const verifying = ref(false)
const verified = ref(false)

// loading
const loading = ref(false)

// modals
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

// modal open/close handlers
function openTermsModal() {
    showTermsModal.value = true
}
function closeTermsModal() {
    showTermsModal.value = false
}
function openPrivacyModal() {
    showPrivacyModal.value = true
}
function closePrivacyModal() {
    showPrivacyModal.value = false
}

// terms checkboxes
const agreeAll = ref(false)
const terms = ref({ service: false, privacy: false, marketing: false })
const toggleAll = () => {
    terms.value.service = agreeAll.value
    terms.value.privacy = agreeAll.value
    terms.value.marketing = agreeAll.value
}

// 정규식: 문자+숫자 포함 8~20자
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
const isPasswordValid = computed(() => passwordRegex.test(password.value))
const isPasswordMatch = computed(() => password.value === confirmPassword.value)

// 전체 폼 유효성
const isFormValid = computed(() => {
    return (
        emailSent.value &&
        verified.value &&
        isPasswordValid.value &&
        isPasswordMatch.value &&
        name.value &&
        birth.value &&
        address.value &&
        terms.value.service &&
        terms.value.privacy
    )
})

// 우편번호 검색
const searchAddress = () => {
    new window.daum.Postcode({
        oncomplete(data) {
            address.value = data.address
        },
    }).open()
}

// 이메일 인증 코드 발송
async function sendAuthCode(event) {
    event.stopImmediatePropagation()
    if (sending.value || !email.value) return
    sending.value = true
    try {
        await authApi.sendEmailCode({ user_id: email.value })
        emailSent.value = true
        alert('인증 코드가 발송되었습니다.')
    } catch (err) {
        console.error(err)
        alert(err.response?.data || '인증 코드 전송에 실패했습니다.')
    } finally {
        sending.value = false
    }
}

// 이메일 인증 코드 검증
async function verifyAuthCode() {
    if (!code.value || verifying.value) return
    verifying.value = true
    try {
        await authApi.verifyEmailCode({ user_id: email.value, code: code.value })
        verified.value = true
        alert('이메일 인증이 완료되었습니다.')
    } catch (err) {
        console.error(err)
        alert(err.response?.data || '인증 코드가 올바르지 않습니다.')
    } finally {
        verifying.value = false
    }
}

// 회원가입 제출
async function submit() {
    if (!emailSent.value || !verified.value) {
        alert('이메일 인증을 완료해주세요.')
        return
    }
    if (!isPasswordValid.value) {
        alert('비밀번호는 문자와 숫자를 모두 포함하여 8~20자여야 합니다.')
        return
    }
    if (!isPasswordMatch.value) {
        alert('비밀번호 확인이 일치하지 않습니다.')
        return
    }
    if (!name.value || !birth.value || !address.value) {
        alert('이름, 생년월일, 주소를 모두 입력해주세요.')
        return
    }
    if (!terms.value.service || !terms.value.privacy) {
        alert('필수 약관에 모두 동의해주세요.')
        return
    }

    loading.value = true
    try {
        await authApi.signup({
            user_id: email.value,
            password: password.value,
            user_name: name.value,
            address: address.value,
            birthdate: birth.value,
        })
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
        router.push('/login')
    } catch (err) {
        console.error(err)
        alert(err.response?.data || '회원가입 중 오류가 발생했습니다.')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
html,
body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
</style>
