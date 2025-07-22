<template>
  <div class="w-full bg-white rounded-2xl border p-5 shadow-sm">
    <template v-if="hasAccount">
      <!-- 납입 상태 -->
      <div class="text-center text-xs font-semibold mb-2 space-y-1">
        <p v-if="hasDepositThisMonth" class="text-green-500">
          🟢 이번 달 청약 납입이 확인되었어요
        </p>
        <p v-else class="text-red-500">🔴 이번 달 청약 납입이 확인되지 않았어요</p>
      </div>

      <!-- 이미지 + 예치금 -->
      <div class="flex flex-col items-center gap-1">
        <img :src="imagePath" alt="zibi" class="w-24 h-24" />
        <p class="text-xs text-gray-400">KB 국민은행 {{ accountNumber }}</p>
        <p class="text-2xl font-extrabold text-black">{{ balance.toLocaleString() }} 원</p>
      </div>

      <!-- 예치금 달성률 -->
      <div class="mt-4">
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 transition-all" :style="{ width: depositRate + '%' }"></div>
        </div>
        <div class="text-right text-xs text-gray-400 mt-1">{{ depositRate }}%</div>

        <div class="text-xs text-gray-500 mt-2 text-center space-y-0.5">
          <p>₩{{ balance.toLocaleString() }} / ₩{{ goal.toLocaleString() }}</p>
          <p v-if="depositRate < 100">
            예치금 달성까지
            <span class="text-red-500 font-semibold">₩{{ (goal - balance).toLocaleString() }}</span> 남았어요!
          </p>
          <p class="text-blue-600 font-semibold" v-if="depositRate >= 100">예치금 목표를 달성했어요!</p>
        </div>
      </div>

      <!-- 지역 및 평수 -->
      <div class="mt-6 flex justify-between text-sm text-gray-700 font-medium px-1">
        <p>거주 지역 : <span class="font-normal">{{ region }}</span></p>
        <p>설정 평수 : <span class="font-normal">{{ areaLabel }}</span></p>
      </div>

      <div class="mt-4">
        <PrimaryButton @click="showModal = true">📏 평수 설정</PrimaryButton>
      </div>

      <!-- 평수 설정 모달 -->
      <AreaSettingModal
        v-if="showModal"
        :modelValue="selectedArea"
        @close="showModal = false"
        @save="updateArea"
      />
    </template>

    <!-- 계좌 미등록 -->
    <template v-else>
      <div class="flex flex-col items-center gap-2">
        <img src="@/assets/images/zibi_0.png" alt="egg" class="w-24 h-24" />
        <p class="text-gray-600 text-sm font-semibold">계좌를 연결해주세요!</p>
        <p class="text-gray-500 text-xs text-center">
          청약통장을 연결하면 예치금 현황과<br />목표 달성률을 실시간으로 확인할 수 있어요
        </p>

        <ul class="text-left text-xs text-gray-700 space-y-1 mt-4 mb-2">
          <li>✅ 실시간 잔액 확인</li>
          <li>✅ 목표 달성률 추적</li>
          <li>✅ 입금금 알림</li>
        </ul>

        <PrimaryButton @click="onConnectAccount">계좌 연결하기</PrimaryButton>
        <p class="text-[10px] text-gray-400 mt-2">🔒 256bit SSL 암호화로 안전하게 보호됩니다</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import AreaSettingModal from '@/components/modal/AreaSettingModal.vue'
import zibi0 from '@/assets/images/zibi_0.png'
import zibi1 from '@/assets/images/zibi_1.png'
import zibi2 from '@/assets/images/zibi_2.png'
import zibi3 from '@/assets/images/zibi_3.png'
import zibi4 from '@/assets/images/zibi_4.png'
import zibi5 from '@/assets/images/zibi_5.png'

const props = defineProps({
  hasAccount: Boolean,
  hasDepositThisMonth: Boolean,
  depositRate: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  goal: { type: Number, default: 0 },
  accountNumber: { type: String, default: '123-45-678901' },
  region: { type: String, default: '서울 구로구' },
  area: { type: Number, default: 84 }
})

const emit = defineEmits(['connect-account'])

const showModal = ref(false)
const selectedArea = ref(props.area)

const areaOptions = [
  { label: '60㎡ 이하', value: 60 },
  { label: '60㎡ ~ 85㎡', value: 85 },
  { label: '85㎡ ~ 100㎡', value: 100 },
  { label: '100㎡ ~ 135㎡', value: 135 },
  { label: '135㎡ 이상', value: 136 }
]

const areaLabel = computed(() => {
  const found = areaOptions.find(opt => opt.value === selectedArea.value)
  return found?.label ?? `${selectedArea.value}㎡`
})

const updateArea = (val) => {
  selectedArea.value = val
  showModal.value = false
}

const onConnectAccount = () => {
  emit('connect-account')
}

const imagePath = computed(() => {
  const index = Math.min(5, Math.floor(props.depositRate / 20))
  return [zibi0, zibi1, zibi2, zibi3, zibi4, zibi5][index]
})
</script>
