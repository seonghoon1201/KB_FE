<template>
  <div class="min-h-screen bg-white px-4 pt- pb-16">
    <!-- 상단 헤더 -->
    <BackHeader title="개인정보 처리방침" />

    <!-- 본문 내용 -->
    <div class="mt-6 space-y-6">
      <div v-for="section in policy" :key="section.title">
        <!-- 항목 제목 -->
        <h2 class="text-base font-bold text-gray-800 mb-2">{{ section.title }}</h2>
        <ul class="space-y-1 text-sm text-gray-700 leading-relaxed pl-2">
          <li
            v-for="(line, idx) in section.content"
            :key="idx"
            class="list-disc ml-5"
            v-if="line !== ''"
          >
            {{ line }}
          </li>
        </ul>
      </div>

      <!-- 부칙 -->
      <div class="pt-4 border-t text-sm text-gray-600">
        <p class="font-semibold">부칙</p>
        <p>이 개인정보 처리방침은 2025년 7월 1일부터 적용됩니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import BackHeader from '@/components/common/BackHeader.vue'

const policy = [
  {
    title: '1. 개인정보의 수집 및 이용 목적',
    content: [
      '회원 식별 및 본인 인증',
      '청약 서비스 제공 및 사용자 맞춤 정보 안내',
      '고객 문의 응대 및 서비스 개선',
    ],
  },
  {
    title: '2. 수집하는 개인정보 항목',
    content: [
      '필수항목: 이메일, 비밀번호, 이름, 생년월일',
      '선택항목: 프로필 이미지, 관심 지역, 가점 정보',
    ],
  },
  {
    title: '3. 개인정보 보유 및 이용기간',
    content: [
      '회원 탈퇴 시 즉시 파기 (단, 관계 법령에 따라 일정 기간 보관될 수 있음)',
      '관련 법령에 따른 보존 항목 및 기간:',
      '- 계약 또는 청약철회 등에 관한 기록: 5년',
      '- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년',
    ],
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content: [
      '회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.',
      '단, 법령에 따라 필요한 경우 또는 이용자가 사전에 동의한 경우에 한해 제공될 수 있습니다.',
    ],
  },
  {
    title: '5. 개인정보의 처리 위탁',
    content: [
      '원활한 서비스 제공을 위하여 개인정보 처리를 위탁할 수 있으며, 위탁 시에는 사전에 고지합니다.',
    ],
  },
  {
    title: '6. 이용자의 권리와 행사 방법',
    content: [
      '이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 수집 및 이용에 대한 동의를 철회할 수 있습니다.',
      '개인정보 열람, 정정, 삭제 요청은 고객센터 또는 마이페이지에서 가능합니다.',
    ],
  },
  {
    title: '7. 개인정보의 안전성 확보 조치',
    content: [
      '비밀번호 암호화, 접근 권한 제한, 백신 프로그램 설치 등 안전한 보호 조치를 시행하고 있습니다.',
    ],
  },
  {
    title: '8. 개인정보 보호책임자',
    content: [
      '이름: 홍길동',
      '이메일: privacy@example.com',
      '문의: 개인정보 관련 문의는 이메일을 통해 접수해주시기 바랍니다.',
    ],
  },
]
</script>
