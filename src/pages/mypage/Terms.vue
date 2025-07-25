<template>
    <div class="min-h-screen bg-white px-4 pt-16 pb-16">
        <!-- 상단 헤더 -->
        <BackHeader title="이용약관" />

        <!-- 약관 본문 -->
        <div class="mt-6 space-y-6">
            <div v-for="section in terms" :key="section.title">
                <!-- 조 제목 -->
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
                <p>이 약관은 2025년 7월 1일부터 시행합니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import BackHeader from '@/components/common/BackHeader.vue'

const terms = [
    {
        title: '제1조 (목적)',
        content: [
            '이 약관은 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.',
        ],
    },
    {
        title: '제2조 (정의)',
        content: [
            '"회사"란 서비스를 제공하는 주체를 말합니다.',
            '"이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.',
        ],
    },
    {
        title: '제3조 (약관의 게시와 개정)',
        content: [
            '본 약관은 서비스 초기 화면에 게시하거나 기타 방법으로 공지합니다.',
            '회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다.',
        ],
    },
    {
        title: '제4조 (서비스의 제공 및 변경)',
        content: [
            '회사는 이용자에게 아래와 같은 서비스를 제공합니다.',
            '- 청약 정보 조회 서비스',
            '- 당첨 가능성 예측 서비스',
            '- 사용자 맞춤 추천 서비스 등',
            '회사는 서비스의 내용을 변경할 수 있으며, 변경 시 사전 공지합니다.',
        ],
    },
    {
        title: '제5조 (서비스의 중단)',
        content: [
            '회사는 시스템 점검, 장애 발생, 천재지변 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.',
        ],
    },
    {
        title: '제6조 (회원가입)',
        content: [
            '이용자는 회사가 정한 절차에 따라 회원가입을 신청해야 합니다.',
            '회사는 이용자의 신청에 대해 승낙함으로써 회원가입이 성립됩니다.',
        ],
    },
    {
        title: '제7조 (이용자의 의무)',
        content: [
            '이용자는 본 약관 및 관련 법령을 준수해야 합니다.',
            '타인의 정보를 도용하거나 서비스를 부정한 목적으로 이용해서는 안 됩니다.',
        ],
    },
    {
        title: '제8조 (개인정보보호)',
        content: ['회사는 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호합니다.'],
    },
    {
        title: '제9조 (책임의 제한)',
        content: [
            '회사는 천재지변, 불가항력 등으로 인한 서비스 중단에 대해 책임을 지지 않습니다.',
            '회사는 이용자의 귀책사유로 발생한 손해에 대해 책임을 지지 않습니다.',
        ],
    },
    {
        title: '제10조 (분쟁의 해결)',
        content: [
            '본 약관과 관련한 분쟁은 회사의 본사 소재지를 관할하는 법원을 제1심 법원으로 합니다.',
        ],
    },
]
</script>
