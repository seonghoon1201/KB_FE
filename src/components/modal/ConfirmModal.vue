<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    @click="$emit('cancel')"
  >
    <div class="bg-white rounded-lg w-80 p-6 relative" @click.stop>
      <h2 class="text-base font-semibold text-gray-800 mb-4">정말 계좌 연결을 해지할까요?</h2>
      <p class="text-sm text-gray-600 mb-5">해지 후에는 예치금 현황을 볼 수 없어요.</p>

      <div class="flex justify-end gap-3">
        <button
          class="text-sm text-gray-500 hover:text-black"
          @click="$emit('cancel')"
        >
          취소
        </button>
        <button
          class="text-sm text-red-600 font-semibold hover:underline"
          @click="$emit('confirm')"
        >
          해지하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
})
defineEmits(['confirm', 'cancel'])
</script>
