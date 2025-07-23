// stores/favorites.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  // 상태 (State)
  const favoriteIds = ref(new Set())
  
  // 게터 (Getters)
  const favoritesCount = computed(() => favoriteIds.value.size)
  
  const favoriteIdsList = computed(() => Array.from(favoriteIds.value))

  const saveFavoritesToStorage = () => {
  const favoritesArray = Array.from(favoriteIds.value)
  console.log('[save] localStorage 저장 시도:', favoritesArray)
  localStorage.setItem('favorites', JSON.stringify(favoritesArray))
}
  
 const isFavorite = (subscriptionId) => {
  return favoriteIds.value.has(subscriptionId)
}

  // 액션 (Actions)
  const addToFavorites = (subscriptionId) => {
    favoriteIds.value.add(subscriptionId)
    saveFavoritesToStorage()
    console.log(`즐겨찾기 추가: ${subscriptionId}`)
  }

  const removeFromFavorites = (subscriptionId) => {
    favoriteIds.value.delete(subscriptionId)
    saveFavoritesToStorage()
    console.log(`즐겨찾기 제거: ${subscriptionId}`)
  }

  const toggleFavorite = (subscriptionId) => {
    if (favoriteIds.value.has(subscriptionId)) {
      removeFromFavorites(subscriptionId)
      return false
    } else {
      addToFavorites(subscriptionId)
      return true
    }
  }

  const clearAllFavorites = () => {
    favoriteIds.value.clear()
    saveFavoritesToStorage()
    console.log('모든 즐겨찾기 삭제')
  }

  // 즐겨찾기한 공고들 가져오기 (다른 스토어와 연동)
  const getFavoriteSubscriptions = (allSubscriptions) => {
    return allSubscriptions.filter(sub => favoriteIds.value.has(sub.id))
  }

  

  const loadFavoritesFromStorage = () => {
  try {
    const saved = localStorage.getItem('favorites')
    const favoritesArray = saved ? JSON.parse(saved) : []
    favoriteIds.value = new Set(favoritesArray)
    console.log('즐겨찾기 로드:', favoritesArray)
  } catch (error) {
    console.error('즐겨찾기 로드 실패:', error)
    favoriteIds.value = new Set()
  } 
}

  // 스토어 초기화시 데이터 로드
  const initializeFavorites = () => {
    loadFavoritesFromStorage()
  }

  return {
    // 상태
    favoriteIds,
    
    // 게터
    favoritesCount,
    favoriteIdsList,
    isFavorite,
    
    // 액션
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    getFavoriteSubscriptions,
    initializeFavorites
  }
})