// stores/notificationStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([
    {
      id: '1',
      title: '7월 예치금 미납',
      date: '2025.07.31 자정',
      timeAgo: '3분 전',
      isRead: false,
      body: '회원님의 7월 예치금 납입이 확인되지 않았습니다.\n빠른 시일 내에 예치금을 납입해 주세요.',
      link: '/account/detail',
    },
    {
      id: '2',
      title: '힐스테이트 청약 접수 시작',
      date: '2025.07.30',
      timeAgo: '1일 전',
      isRead: true,
      body: '힐스테이트 아파트의 청약 접수가 시작되었습니다.\n지금 바로 신청하실 수 있습니다.',
      link: '/subscription/detail/123',
    },
  ])

  const markAsRead = (id) => {
    const target = notifications.value.find((n) => n.id === id)
    if (target) target.isRead = true
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.isRead = true))
  }

  return { notifications, markAsRead, markAllAsRead }
})
