<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4"
  >
    <div class="bg-white w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">개인정보 수집 및 이용 동의</h2>
      <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {{ privacyText }}
      </div>

      <!-- 중앙 정렬된 닫기 버튼 -->
      <div class="mt-6 flex justify-center">
        <button
          class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-1"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ visible: Boolean })
defineEmits(['close'])

const privacyText = ref(`

1. 수집 항목
- 필수 항목: 이름, 이메일, 비밀번호, 생년월일, 주소
- 선택 항목: 마케팅 수신 동의 여부

2. 수집 목적
- 회원 식별 및 본인 확인
- 서비스 제공 및 이용에 따른 본인 인증
- 고객 상담 및 불만 처리
- 신규 서비스 및 이벤트 안내

3. 보유 및 이용 기간
- 회원 탈퇴 시까지 보관하며, 관련 법령에 따라 일정 기간 보관이 필요할 경우 해당 기간 동안 보관

4. 동의를 거부할 권리 및 불이익
- 개인정보 수집에 동의하지 않을 수 있으며, 이 경우 서비스 이용에 제한이 있을 수 있습니다.

※ 그 외 개인정보 처리에 관한 사항은 ‘개인정보처리방침’을 따릅니다.
`)
</script>
