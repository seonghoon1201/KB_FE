import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
    let items = ref([])
    let unreadCount = ref(0)

    function add(payload) {
        const { notification, data } = payload
        const item = {
            id: crypto.randomUUID(),
            title: notification?.title || data?.title || '알림',
            body: notification?.body || data?.body || '',
            url: data?.url || null, // 서버에서 webpush.fcm_options.link로도 보낼 예정
            data: data || {},
            read: false,
            receivedAt: new Date().toISOString(),
        }

        items.value.unshift(item)
        unreadCount.value++
    }

    function allRead() {
        items.value = items.value.map((item) => ({ ...item, read: true }))
        unreadCount.value = 0
    }

    return {
        items,
        unreadCount,
        add,
        allRead,
    }
})
