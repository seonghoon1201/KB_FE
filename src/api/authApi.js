import api from './axios'

export default {
    // 로그인
    async login({ user_id, password }) {
        return api.post('/auth/login', { user_id, password })
    },
    // 카카오 로그인
    async kakaoLogin(code) {
        return api.post('/kakao/callback', { code })
    },
    // 회원가입
    async signup({ user_id, password, user_name, address, birthdate }) {
        return api.post('/auth/signup', {
            user_id,
            password,
            user_name,
            address,
            birthdate,
        })
    },
    // 이메일 인증 코드 발송
    async sendEmailCode({ user_id }) {
        return api.post('/email', { user_id })
    },
    // 인증 코드 확인
    async verifyEmailCode({ user_id, code }) {
        return api.post('/email/verification', { user_id, code })
    },
    // 비밀번호 재설정
    async refreshPassword({ user_id, new_password }) {
        return api.put('/auth/resetpassword', { user_id, new_password })
    },
    // 비밀번호 변경
    async changepassword({ new_password, old_password }) {
        return api.put('/auth/changepassword', { old_password, new_password })
    },
    // 액세스 토큰 만료 시 리프레시 토큰 보내기
    async refreshToken(refresh_token) {
        return api.post('/auth/refresh', { refresh_token })
    },
    // 로그아웃
    async logout() {
        return api.post('/auth/logout')
    },
    // 회원탈퇴
    async signout() {
        return api.delete('/auth/signout')
    },
}
