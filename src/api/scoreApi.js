// src/api/scoreApi.js
import api from './axios'

export default {
  /**
   * POST /v1/ga-score
   * RequestDto:
   * {
   *   dependents_nm: number,
   *   disposal_date: string|null,
   *   head_of_household: 0|1,
   *   house_disposal: 0|1,
   *   house_owner: 0|1,
   *   marital_status: 0|1,
   *   no_house_period: number,
   *   wedding_date: string|null
   * }
   *
   * ResponseDto: 동일 구조에 더해
   * {
   *   dependents_score: number,
   *   no_house_score: number,
   *   payment_period_score: number,
   *   total_ga_score: number,
   *   evaluation: string
   * }
   */
  calculateScore(payload) {
    return api.post('/ga-score', payload)
  },

  /** GET /v1/ga-score */
  getLastScore() {
    return api.get('/ga-score')
  },
}
