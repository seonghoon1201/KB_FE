// src/stores/preference.js
import { defineStore } from 'pinia'
import api from '@/api/axios'

const PERSIST_KEY = 'pref.v1' // 로컬 백업 키

const hasServerPrefs = (d) => {
    if (!d || typeof d !== 'object') return false
    return (
        Array.isArray(d.selected_region) ||
        Array.isArray(d.selected_homesize) ||
        Array.isArray(d.selected_hometype) ||
        (d.user_info && (d.user_info.hope_min_price != null || d.user_info.hope_max_price != null))
    )
}

export const usePreferenceStore = defineStore('preference', {
    state: () => ({
        isSet: false,
        regions: [], // [{ city, district }]
        area: null, // [min, max]
        priceRange: [null, null], // [minMan, maxMan]
        types: [], // ['APT','오피스텔']
        loading: false,
    }),
    persist: { paths: ['isSet', 'regions', 'area', 'priceRange', 'types'] },

    actions: {
        // 백업 저장/복구
        saveLocal() {
            const payload = {
                isSet: this.isSet,
                regions: this.regions,
                area: this.area,
                priceRange: this.priceRange,
                types: this.types,
            }
            try {
                localStorage.setItem(PERSIST_KEY, JSON.stringify(payload))
            } catch {}
        },
        loadLocal() {
            try {
                const raw = localStorage.getItem(PERSIST_KEY)
                if (!raw) return false
                const p = JSON.parse(raw)
                this.isSet = !!p.isSet
                this.regions = p.regions || []
                this.area = p.area || null
                this.priceRange = Array.isArray(p.priceRange) ? p.priceRange : [null, null]
                this.types = p.types || []
                return this.isSet
            } catch {
                return false
            }
        },

        markSet(v = true) {
            this.isSet = !!v
            this.saveLocal()
        },

        // 서버 → 스토어로 반영
        setFromServer(data) {
            this.regions = (data?.selected_region || []).map((r) => ({
                city: r.si || '',
                district: r.gun_gu || '전체',
            }))
            const hs = data?.selected_homesize?.[0]
            this.area = hs ? [Number(hs.min_homesize) || 0, Number(hs.max_homesize) || 0] : null
            this.types = (data?.selected_hometype || []).map((t) =>
                String(t.selected_house_secd || ''),
            )
            this.priceRange = [
                data?.user_info?.hope_min_price ?? null,
                data?.user_info?.hope_max_price ?? null,
            ]
            this.isSet = !!(
                this.regions.length ||
                this.area ||
                this.types.length ||
                this.priceRange[0] != null ||
                this.priceRange[1] != null
            )
            this.saveLocal() // ✅ 서버 반영 후 백업 저장
        },

        // 폼에서 바로 스토어에 반영 (POST 성공 직후 사용)
        setFromClient({ regions, area, types, priceRange }) {
            this.regions = regions
            this.area = area
            this.types = types
            this.priceRange = priceRange
            this.isSet = true
            this.saveLocal() // ✅ 즉시 백업 저장
        },

        async hydrate() {
            try {
                this.loading = true
                const { data } = await api.get('/user/preferences')
                if (hasServerPrefs(data)) {
                    this.setFromServer(data)
                } else {
                    console.warn(
                        '[preference] hydrate: server returned no/invalid prefs; kept local state',
                    )
                    // ✅ 서버가 비정상이면 백업/퍼시스트로 복구
                    if (!this.isSet) this.loadLocal()
                }
            } catch (e) {
                console.warn('[preference] hydrate failed; kept local state', e?.response?.status)
                if (!this.isSet) this.loadLocal()
            } finally {
                this.loading = false
            }
        },
    },
})
