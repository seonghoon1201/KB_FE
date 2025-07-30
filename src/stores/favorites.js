// src/stores/favorites.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import api from '@/api/axios'

export const useFavoritesStore = defineStore('favorites', () => {
    const userStore = useUserStore() // ← 이 줄을 꼭 추가!
    const favoriteIds = ref(new Set())

    const favoritesCount = computed(() => favoriteIds.value.size)
    const favoriteIdsList = computed(() => Array.from(favoriteIds.value))
    const isFavorite = (id) => favoriteIds.value.has(id)

    async function fetchFavoritesFromServer() {
        const userStore = useUserStore()
        console.log('userStore.id:', userStore.id)
        console.log('userStore.id.value:', userStore.id?.value)
        if (!userStore.isLoggedIn) return

        try {
            const res = await api.get('/me/favorite/list')
            const raw = res.data['favorites(즐겨찾기목록)'] || []
            const ids = raw.map((item) => item.apt_idx ?? item.offi_idx)
            favoriteIds.value = new Set(ids)
            localStorage.setItem('favorites', JSON.stringify(ids))
        } catch (err) {
            console.error('서버 즐겨찾기 로드 실패:', err)
        }
    }

    async function addToFavorites(subscription) {
        const userStore = useUserStore()

        const payload = {
            noticeIdx: subscription.id, // 서버 요구사항
            houseType: subscription.house_type ?? '', // 아파트 / 오피스텔 등
            usersIdx: userStore.user_id, // 로그인 유저 고유 ID
        }

        console.log('▶ 즐겨찾기 추가 요청 payload:', payload)

        try {
            await api.post('/me/favorite', payload)
            console.log('✅ 서버 즐겨찾기 추가 성공')
        } catch (err) {
            const status = err.response?.status
            const data = err.response?.data
            console.warn(`🚨 서버 에러(${status}):`, data)
            if (status !== 400 || !String(data).includes('이미 즐겨찾기')) {
                throw err
            }
        } finally {
            await fetchFavoritesFromServer()
        }
    }

    async function removeFromFavorites(id) {
        if (!favoriteIds.value.has(id)) return
        try {
            await api.delete(`/me/favorite/${id}`)
            favoriteIds.value.delete(id)
            localStorage.setItem('favorites', JSON.stringify([...favoriteIds.value]))
        } catch (err) {
            console.error('서버 즐겨찾기 제거 실패:', err)
        }
    }

    async function toggleFavorite(subscription) {
        const id = subscription.noticeIdx ?? subscription.id // noticeIdx가 없으면 id fallback
        if (favoriteIds.value.has(id)) {
            await removeFromFavorites(id)
            return false
        } else {
            await addToFavorites(subscription)
            return true
        }
    }

    async function initializeFavorites() {
        // 1) 로컬 불러오기
        const saved = localStorage.getItem('favorites')
        if (saved) favoriteIds.value = new Set(JSON.parse(saved))

        // 2) 로그인·토큰 체크 후 서버 동기화
        if (!userStore.isLoggedIn || !userStore.accessToken) {
            console.log('즐겨찾기 동기화 스킵 (로그인 필요)')
            return
        }
        await fetchFavoritesFromServer()
    }

    return {
        favoriteIds,
        favoritesCount,
        favoriteIdsList,
        isFavorite,
        fetchFavoritesFromServer,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        initializeFavorites,
    }
})
