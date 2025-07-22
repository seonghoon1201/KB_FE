<template>
    <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4"
    >
        <div class="bg-white w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">이용약관</h2>
            <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {{ termsText }}
            </div>
            <div class="mt-6 flex justify-center">
                <button
                    class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-1"
                    @click="$emit('close')"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    닫기
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    visible: Boolean,
})
defineEmits(['close'])

const termsText = ref(`
제1조 (목적)
이 약관은 지비(이하 "당사")가 제공하는 모든 서비스(이하 "서비스")의 이용과 관련하여 이용자와 당사 간의 권리·의무 및 책임사항 등을 정하는 것을 목적으로 합니다.

제2조 (정의)
“서비스”란 당사가 운영하는 웹/모바일 플랫폼을 통해 제공되는 콘텐츠, 기능 및 정보를 의미합니다.
“이용자”란 본 약관에 따라 당사의 서비스에 접속하여 이용하는 모든 회원 및 비회원을 말합니다.

제3조 (약관 동의 및 변경)
본 약관에 동의함으로써 이용자는 당사의 서비스를 이용할 수 있습니다.
당사는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 즉시 효력이 발생합니다.

제4조 (회원가입 및 탈퇴)
이용자는 서비스 내 제공되는 양식에 따라 회원가입을 신청할 수 있습니다.
이용자는 언제든지 서비스 내 설정을 통해 탈퇴할 수 있습니다. 데이터는 관련 법령에 따라 보관 또는 삭제됩니다.

제5조 (서비스 제공 및 변경)
당사는 안정적인 서비스 제공을 위해 노력하며, 일부 콘텐츠는 회원에게만 제공될 수 있습니다.
서비스의 내용은 필요에 따라 변경될 수 있으며, 중대한 변경 시 사전 공지합니다.

제6조 (이용자의 의무)
이용자는 다음 행위를 해서는 안 됩니다:
- 타인의 정보를 도용하는 행위
- 서비스 운영을 방해하는 행위
- 법령 또는 공공질서·미풍양속에 위반되는 행위
위반 시 서비스 이용 제한 및 법적 조치를 취할 수 있습니다.

제7조 (개인정보보호)
당사는 관련 법령에 따라 이용자의 개인정보를 안전하게 보호합니다.
자세한 내용은 ‘개인정보처리방침’을 따릅니다.

제8조 (지적재산권)
서비스 내 모든 콘텐츠의 저작권은 당사 또는 정당한 권리를 가진 자에게 있으며, 무단 복제·배포를 금지합니다.

제9조 (면책조항)
당사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.
이용자의 귀책 사유로 인한 손해에 대해서도 책임지지 않습니다.

제10조 (분쟁해결 및 관할법원)
본 약관과 관련된 분쟁은 당사와 이용자 간 상호 협의하여 해결하며, 협의가 어려울 경우 서울중앙지방법원을 관할 법원으로 합니다.
`)
</script>
