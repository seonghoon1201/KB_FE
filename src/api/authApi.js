// src/api/Authapi.js
import api from './axios'

export default {
    login({ user_id, password }) {
        return api.post('/auth/login', { user_id, password })
    },
    signup({ user_id, password, name, phone, birthdate }) {
        return api.post('/auth/register', {
            user_id,
            password,
            name,
            phone,
            birthdate,
        })
    },
    requestResetPassword(email) {
        return api.post('/auth/find-password', { email })
    },
    verifyResetCode({ email, code }) {
        return api.post('/auth/verify-code', { email, code })
    },
    resetPassword({ email, newPassword }) {
        return api.post('/auth/reset-password', { email, newPassword })
    },
    refreshToken(refresh_token) {
        return api.post('/auth/refresh', { refresh_token })
    },
    logout() {
        return api.post('/auth/logout')
    },
}
