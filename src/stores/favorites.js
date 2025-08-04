import { ref } from 'vue'
import { defineStore } from 'pinia'
import favoriteApi from '@/api/favoriteApi'

export const useFavoritesStore = defineStore('favorites', () => {
    // 상태
    const favorites = ref([])

    // 즐겨찾기 정보 가져오기
    async function getFavorite() {
        try {
            const data = await favoriteApi.initializeFavorites()
            favorites.value = data

            return data
        } catch (e) {
            console.log('즐겨찾기 데이터 조회 실패 : ', e)
            favorites.value = []
        }
    }

    // 즐겨찾기 추가
    async function addFavorite(param) {
        try {
            // 1. 서버에 즐겨찾기 추가 요청 (await 꼭 사용)
            let params = {
                house_type: param.house_type,
                pblanc_no: param.pblanc_no,
            }
            await favoriteApi.addFavorite(params)

            // 2. 클라이언트 favorites 목록에 중복 없이 추가
            const alreadyExists = favorites.value.some(
                (item) =>
                    item.pblanc_no === param.pblanc_no && item.house_type === param.house_type,
            )

            if (!alreadyExists) {
                favorites.value.push({ ...param, is_favorite: true })
            }
        } catch (e) {
            console.log('즐겨찾기 데이터 조회 실패 : ', e)
        }
    }

    // 즐겨찾기 삭제
    async function removeFavorite(param) {
        try {
            // 1. 서버에 즐겨찾기 삭제 요청 (await 꼭 사용)
            let params = {
                house_type: param.house_type,
                pblanc_no: param.pblanc_no,
            }
            await favoriteApi.removeFavorite(params)

            // 2. 클라이언트 favorites 목록에서 해당 아이템만 제거
            favorites.value = favorites.value.filter(
                (item) =>
                    !(item.pblanc_no === param.pblanc_no && item.house_type === param.house_type),
            )

            return favorites.value
        } catch (e) {
            console.log('즐겨찾기 데이터 조회 실패 : ', e)
        }
    }

    // 즐겨찾기 여부 확인 -> 하트 true / false 구분
    function isFavorite(house_type, pblanc_no) {
        return favorites.value.some(
            (fav) => fav.house_type === house_type && fav.pblanc_no === pblanc_no,
        )
    }

    return {
        favorites,
        getFavorite,
        addFavorite,
        removeFavorite,
        isFavorite,
    }
})
