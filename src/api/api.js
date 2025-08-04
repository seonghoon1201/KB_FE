// src/api/api.js
import axios from 'axios';

// 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: '15.165.143.27', // 백엔드 주소
  withCredentials: true,           // 필요 시 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (예: 토큰 추가)
api.interceptors.request.use(
  (config) => {
    // 필요하면 토큰을 로컬스토리지에서 가져와 넣기
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default api;