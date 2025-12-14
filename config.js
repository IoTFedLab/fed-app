// API 설정
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? '';

export const API_CONFIG = {
  BASE_URL: baseUrl,
  ENDPOINTS: {
    MODELS: '/model'
  }
};
