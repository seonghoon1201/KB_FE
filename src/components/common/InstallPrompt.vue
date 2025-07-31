<!-- src/components/common/InstallPrompt.vue -->
<template>
    <div v-if="showButton" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button
            @click="triggerInstall"
            class="px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-semibold shadow-md hover:bg-blue-600 transition"
        >
            앱 설치하기
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showButton = ref(false)
let deferredPrompt = null

onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        showButton.value = true
    })
})

const triggerInstall = async () => {
    if (!deferredPrompt) return
    showButton.value = false
    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
        console.log('PWA 설치 완료 🎉')
    } else {
        console.log('PWA 설치 취소됨 😢')
    }
    deferredPrompt = null
}
</script>
