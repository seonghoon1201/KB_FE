<template>
    <div>
        <button
            @click="toggle"
            class="w-5 h-5 flex items-center justify-center bg-white text-black transition-colors ml-3"
            aria-label="정보 보기"
        >
            <Info />
        </button>

        <teleport to="body">
            <transition name="fade">
                <div
                    v-if="visible"
                    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40"
                    @click.self="visible = false"
                >
                    <div
                        class="bg-white w-full max-w-md mx-auto rounded-t-2xl sm:rounded-xl p-6 shadow-xl text-[17px] leading-relaxed text-gray-900"
                    >
                        <!-- 제목 -->
                        <h2 class="text-xl font-bold mb-6">{{ title }}</h2>

                        <!-- 내용 -->
                        <div class="text-sm text-gray-800 leading-relaxed">
                            <slot />
                        </div>

                        <!-- 닫기 버튼 -->
                        <button
                            class="mt-6 w-full text-base font-semibold text-center text-blue-600 hover:underline"
                            @click="visible = false"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Info } from 'lucide-vue-next'
defineProps({
    title: {
        type: String,
        required: true,
    },
})

const visible = ref(false)
const toggle = () => (visible.value = !visible.value)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
