import { ref } from 'vue'
import { defineStore } from 'pinia'
import chatApi from '@/api/chatApi'

export const useChatStore = defineStore('chat', () => {
    let chatLog = ref([])

    async function getMessage(message) {
        const chat = await chatApi.sendMessage(message)
    }

    return {
        chatLog,
    }
})
