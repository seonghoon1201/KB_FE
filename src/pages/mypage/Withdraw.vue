<template>
  <div class="min-h-screen bg-[#F8FBFD] px-4 pt-20 pb-10">
    <!-- 상단 헤더 -->
    <BackHeader title="회원 탈퇴" />

    <!-- 안내 박스 -->
    <div class="mt-6 space-y-4">
      <p class="text-base font-bold text-gray-900">주의하세요!</p>
      <p class="text-sm text-gray-700">
        회원 탈퇴 시 다음과 같은 정보들이 삭제됩니다.
      </p>

      <!-- 삭제 안내 리스트 -->
      <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 space-y-2 text-sm text-gray-800">
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
      <p class="text-xs text-red-500 font-medium">
        삭제된 정보는 복구할 수 없으니 신중하게 결정해주세요.
      </p>

      <!-- 비밀번호 입력 -->
      <div class="mt-6">
        <label for="password" class="text-sm font-medium text-gray-700">비밀번호 확인</label>
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
        @click="handleWithdraw"
        class="mt-6 w-full py-2.5 rounded-md text-sm font-semibold text-white transition
               bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        탈퇴하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { HeartHandshake, FileWarning, FlagOff, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const password = ref('')
const router = useRouter()

const handleWithdraw = () => {
  // TODO: 백엔드 연동 시 탈퇴 요청 보내기
  alert('회원 탈퇴 처리가 완료되었습니다.')
  router.push('/login') // 또는 홈 화면 등으로 이동
}
</script>
