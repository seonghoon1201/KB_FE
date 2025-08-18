import api from './axios'

export default {
    fetchRecommendations() {
        // GET /recommendation (Authorization 헤더 필요)
        return api.get('/user/preferences')
    },
}` `
