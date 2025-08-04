<template>
    <button
        v-bind="$attrs"
        :class="[
            // ✅ 공통 스타일
            'h-10 bg-[#00AEFF] text-white text-sm font-semibold rounded-[10px] flex items-center justify-center',
            // ✅ fullWidth 여부
            fullWidth ? 'w-full' : 'w-max shrink-0 whitespace-nowrap',
            // ✅ 추가 클래스
            customClass,
        ]"
        @click="handleClick"
    >
        <slot />
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    /** 버튼 폭을 100%로 할지 여부 – 기본값 true(이전과 동일) */
    fullWidth: { type: Boolean, default: true },
    /** 추가 Tailwind 클래스 */
    customClass: { type: String, default: '' },
})

const emit = defineEmits(['click'])
function handleClick(e) {
    // 부모에서 .stop 쓰지 않아도 중복 전파 방지
    e.stopImmediatePropagation?.()
    emit('click', e)
}
</script>
