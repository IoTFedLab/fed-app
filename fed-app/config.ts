// API 설정
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? '';

export const API_CONFIG = {
  BASE_URL: baseUrl,  // 기본값은 로컬 IP
  ENDPOINTS: {
    MODELS: '/model'  // 백엔드와 일치
  }
};
