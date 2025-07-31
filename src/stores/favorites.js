import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useFavoritesStore = defineStore('favorites', () => {
  // 상태
  const favorites = ref([])

  // 즐겨찾기 여부 확인
  function isFavorite(house_type, pblanc_no) {
    return favorites.value.some(
      fav => fav.house_type === house_type && fav.pblanc_no === pblanc_no
    )
  }

  // 즐겨찾기 목록 초기화
  async function initializeFavorites() {
    try {
      const res = await api.get('/me/favorite')
      // 서버 응답이 배열인지 확인하고 세팅
      favorites.value = Array.isArray(res.data) ? res.data : []
    } catch (err) {
      console.error('즐겨찾기 목록 로드 실패', err)
      favorites.value = [] // 실패 시 빈 배열
    }
  }

  // 즐겨찾기 추가
  async function addFavorite({ house_type, pblanc_no }) {
    try {
      await api.post('/favorites', { house_type, pblanc_no })
      favorites.value.push({ house_type, pblanc_no })
    } catch (err) {
      console.error('즐겨찾기 추가 실패', err)
    }
  }

  // 즐겨찾기 삭제
  async function removeFavorite({ house_type, pblanc_no }) {
    try {
      await api.delete('/favorites', {
        data: { house_type, pblanc_no }, // DELETE 요청에 data 필요
      })
      favorites.value = favorites.value.filter(
        fav => !(fav.house_type === house_type && fav.pblanc_no === pblanc_no)
      )
    } catch (err) {
      console.error('즐겨찾기 삭제 실패', err)
    }
  }

  return {
    favorites,
    isFavorite,
    initializeFavorites,
    addFavorite,
    removeFavorite,
  }
})