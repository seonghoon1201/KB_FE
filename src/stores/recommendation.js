// src/stores/recommendation.js
import { defineStore } from 'pinia'
import api from '@/api/axios'
import { usePreferenceStore } from '@/stores/preference'
import { useSubscriptionsStore } from '@/stores/subscription' // 전체 공고 목록 스토어

export const useRecommendationStore = defineStore('recommendation', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),
    getters: {
        top3: (s) => s.list.slice(0, 3),
        hasData: (s) => s.list.length > 0,
    },
    actions: {
        async fetch() {
            this.loading = true
            this.error = null
            try {
                // 1) 서버 호출: 현재 /user/preferences는 ‘선호값’을 돌려줌
                const { data } = await api.get('/user/preferences')
                console.log('[recommendation] /user/preferences raw ->', data)

                // 2) 추천 배열이 바로 오면 사용
                if (Array.isArray(data)) {
                    this.list = data
                } else if (Array.isArray(data?.recommendations)) {
                    this.list = data.recommendations
                } else {
                    // 3) 선호값만 온 경우 → 로컬 스코어링
                    const subsStore = useSubscriptionsStore()
                    if (!subsStore.subscriptions?.length) {
                        await subsStore.fetchSubscriptions?.()
                    }
                    this.list = makeLocalRecommendations(subsStore.subscriptions, data)
                }

                console.log('[recommendation] parsed list ->', this.list)
            } catch (e) {
                this.error = e?.response?.data || e
                console.error(
                    '[recommendation] fetch error ->',
                    e?.response?.status,
                    e?.response?.data || e,
                )
                this.list = []
            } finally {
                this.loading = false
                console.log('[recommendation] loading ->', this.loading)
            }
        },
        clear() {
            this.list = []
            this.error = null
            console.log('[recommendation] list cleared')
        },
    },
})

/** 서버 선호 payload(스웨거 예시) 기반 로컬 추천 생성 */
function makeLocalRecommendations(all, pref) {
    if (!Array.isArray(all) || !all.length) return []

    const regions = (pref?.selected_region || []).map((r) => ({
        city: r.si || '',
        district: r.gun_gu || '',
    }))

    const hs = pref?.selected_homesize?.[0]
    const area = hs ? [Number(hs.min_homesize) || 0, Number(hs.max_homesize) || 0] : null

    const types = (pref?.selected_hometype || []).map((t) => String(t.selected_house_secd || ''))
    const typeSet = types.length ? types : ['APT', '오피스텔']

    const minMan = Number(pref?.user_info?.hope_min_price) || 0
    const maxMan = Number(pref?.user_info?.hope_max_price) || 10_000_000 // 1000억(만원)

    const W = { region: 5, area: 3, type: 2, price: 1 }

    return all
        .map((item) => {
            let score = 0
            const city = item.city || ''
            const district = item.district || ''

            const regionOk = regions.length
                ? regions.some((r) => {
                      const cOk = city.includes(r.city)
                      const gOk =
                          !r.district || r.district === '전체'
                              ? true
                              : district.includes(r.district)
                      return cOk && gOk
                  })
                : true
            if (regionOk) score += W.region

            const minA = Number(item.min_area) || 0
            const maxA = Number(item.max_area) || 0
            if (Array.isArray(area) && area.length === 2) {
                const [aMin, aMax] = area
                if (maxA >= aMin && minA <= aMax) score += W.area
            }

            const typeStr = (item.house_secd || item.type || '').toString()
            if (typeSet.some((t) => typeStr.includes(t))) score += W.type

            const minP = Number(item.min_price) || 0
            const maxP = Number(item.max_price) || 0
            if (maxP >= minMan && minP <= maxMan) score += W.price

            return { item, score }
        })
        .sort((a, b) => b.score - a.score)
        .map((s) => s.item)
}
