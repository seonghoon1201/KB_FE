import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [], // 즐겨찾기된 공고 리스트
    }),
    actions: {
        async initializeFavorites() {
            const res = await api.get('/me/favorite')
            this.favorites = res.data
        },

        async addFavorite({ house_type, pblanc_no }) {
            try {
                await api.post('/favorites', { house_type, pblanc_no })
                this.favorites.push({ house_type, pblanc_no })
            } catch (err) {
                console.error('즐겨찾기 추가 실패', err)
            }
        },

        async removeFavorite({ house_type, pblanc_no }) {
            try {
                await api.delete('/favorites', {
                    data: { house_type, pblanc_no }, // DELETE도 data 필요
                })
                this.favorites = this.favorites.filter(
                    f => !(f.house_type === house_type && f.pblanc_no === pblanc_no),
                )
            } catch (err) {
                console.error('즐겨찾기 삭제 실패', err)
            }
        },

        isFavorite(house_type, pblanc_no) {
            return this.favorites.some(
                f => f.house_type === house_type && f.pblanc_no === pblanc_no,
            )
        },
    },
})