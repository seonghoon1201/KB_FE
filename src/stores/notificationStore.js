// 공지사항 스토어
import { ref } from 'vue'
import { defineStore } from 'pinia'
import notificationApi from '@/api/notificationApi'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([]) // 알림 전체 목록
    const maxIndex = ref(0)
    let unreadCount = ref(0) // 안 읽은 알림 개수

    // 안읽음 알림 개수 카운트
    async function countIsRead() {
        const data = await notificationApi.getList()

        unreadCount.value = data.filter((item) => item.read === false).length
        console.log('countIsRead unreadCount.value : ', unreadCount.value)
    }

    // 알람 목록 조회
    async function getList() {
        notifications.value = []
        const data = await notificationApi.getList()

        const now = new Date().dateStringFormat(new Date(), '.')

        data.map((item) => {
            notifications.value.push({
                id: item.alarmIdx,
                title: item.title,
                date: item.alarmDate,
                timeAgo:
                    now === item.alarmDate
                        ? new Date().diffTime(
                              new Date(),
                              new Date(item.alarmDate + ' ' + item.alarmTime),
                          ) + '분 전'
                        : new Date().diffDate(new Date(), new Date(item.alarmDate)) + '일 전',
                isRead: item.read,
            })
        })

        unreadCount.value = data.filter((item) => item.read === false).length
    }

    // 알람 단건 상세 조회
    async function getItem(alarmIdx) {
        const data = await notificationApi.getItem(alarmIdx)

        notifications.value = notifications.value.map((item) => {
            if (item.id === alarmIdx) return { ...item, isRead: true }
            else return item
        })

        const now = new Date().dateStringFormat(new Date(), '.')
        const returnData = {
            id: data.alarmIdx,
            type: data.alarmType,
            title: data.title,
            date: data.alarmDate,
            timeAgo:
                now === data.alarmDate
                    ? new Date().diffTime(
                          new Date(),
                          new Date(data.alarmDate + ' ' + data.alarmTime),
                      ) + '분 전'
                    : new Date().diffDate(new Date(), new Date(data.alarmDate)) + '일 전',
            content: data.content,
            routing: data.routing,
            link: data.link,
            userIndex: data.usersIdx,
            read: data.read,
            houseType: data.house_type,
        }

        return returnData
    }

    // 알람 전체 삭제
    async function deleteList() {
        await notificationApi.deleteList()

        notifications.value = []
    }

    // 알람 삭제
    async function deleteItem(alarmIdx) {
        const response = await notificationApi.deleteItem(alarmIdx)

        notifications.value = notifications.value.filter((item) => item.id !== alarmIdx)

        return response
    }

    // 모두 읽음 처리
    async function readAll() {
        await notificationApi.readAll()

        notifications.value.forEach((item) => {
            item.isRead = true
        })

        unreadCount.value = 0
    }

    // 새 청약 공고 알람 생성
    async function newNotice(params) {
        const { respose } = await notificationApi.newNotice(params)

        notifications.value.push({
            alarmDate: new Date().dateStringFormat(new Date(), '.'),
            alarmIdx: respose.alarmIdx,
            alarmTime: new Date().dateTimeStringFormat(new Date()),
            read: false,
            title: '테스트',
        })
    }

    // 청약 접수 시작 알람 생성
    async function applicationStart(params) {
        await notificationApi.applicationStart(params)

        maxIndex.value += 1

        notifications.value.push({
            alarmDate: new Date().dateStringFormat(new Date(), '.'),
            alarmIdx: maxIndex.value,
            alarmTime: new Date().dateTimeStringFormat(new Date()),
            read: false,
            title: '테스트',
        })
    }

    // 예치금 미납 알람 생성
    async function createDepositunpaid(params) {
        await notificationApi.createDepositunpaid(params)

        maxIndex.value += 1

        notifications.value.push({
            alarmDate: new Date().dateStringFormat(new Date(), '.'),
            alarmIdx: maxIndex.value,
            alarmTime: new Date().dateTimeStringFormat(new Date()),
            read: false,
            title: '테스트',
        })
    }

    return {
        notifications,
        unreadCount,
        countIsRead,
        getList,
        getItem,
        deleteList,
        deleteItem,
        readAll,
        newNotice,
        applicationStart,
        createDepositunpaid,
    }
})
