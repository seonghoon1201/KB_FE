// 선호설정 스토어
import { defineStore } from 'pinia'

export const usePreferenceStore = defineStore('preference', {
  state: () => ({
    city: '',
    district: '',
    areas: [],
    priceRange: [null, null],
    types: []
  }),
  actions: {
    setPreference(payload) {
      this.city = payload.city
      this.district = payload.district
      this.areas = payload.areas
      this.priceRange = payload.priceRange
      this.types = payload.types
    }
  }
})
