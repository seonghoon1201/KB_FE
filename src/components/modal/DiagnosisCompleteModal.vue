<template>
    <transition name="fade">
        <div
            v-if="visible"
            class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
        >
            <div
                class="bg-white rounded-2xl w-full max-w-md p-6 mx-4 text-center shadow-xl relative"
            >
                <button @click="close" class="absolute top-4 right-4 text-gray-500">✕</button>
                <h2 class="text-lg font-bold mb-6">진단을 모두 완료했어요! 고생하셨어요</h2>

                <div class="flex items-center gap-3 mb-4">
                    <Home class="w-8 h-8 text-blue-500" />
                    <div class="text-left">
                        <p class="text-sm font-semibold">공공분양, 민간분양</p>
                        <p class="text-sm text-gray-500">지원 가능 여부를 진단해드릴게요</p>
                    </div>
                </div>

                <div class="flex items-center gap-3 mb-6">
                    <Lightbulb class="w-8 h-8 text-yellow-500" />
                    <div class="text-left">
                        <p class="text-sm font-semibold">특별공급</p>
                        <p class="text-sm text-gray-500">
                            지원 가능 여부를 조회할 수 있게 준비 중이에요
                        </p>
                    </div>
                </div>

                <button
                    class="w-full bg-blue-500 text-white font-bold py-3 rounded-full"
                    @click="goToResult"
                >
                    확인
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Home, Lightbulb } from 'lucide-vue-next'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const router = useRouter()

const close = () => emit('close')

const goToResult = () => {
    emit('close')
    router.push('/score/result')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
