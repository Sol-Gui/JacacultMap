/**
 * 📱 EXEMPLO: Como configurar o cliente Expo/React Native para enviar header X-Client
 * 
 * Arquivo: jacacultmap-app/services/api.tsx
 */

import axios, { AxiosInstance } from 'axios';

// ✅ Configuração do cliente HTTP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'app', // ✅ IMPORTANTE: Identifica como app mobile
  },
});

// Interceptor para debug
apiClient.interceptors.request.use((config) => {
  console.log('📤 Requisição:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * 📝 EXEMPLO DE USO:
 * 
 * import apiClient from '@/services/api';
 * 
 * async function loginWithGoogle() {
 *   try {
 *     const response = await apiClient.post('/auth/google/url');
 *     // O header X-Client: app será automaticamente incluído!
 *     const { url } = response.data;
 *     // ... redirecionar para URL
 *   } catch (error) {
 *     console.error('Erro ao fazer login:', error);
 *   }
 * }
 */

/**
 * 🔐 HEADERS ENVIADOS AUTOMATICAMENTE:
 * 
 * X-Client: app
 * Content-Type: application/json
 * User-Agent: Expo/...  (automaticamente do React Native)
 * 
 * Backend receberá:
 * ✅ Header X-Client === 'app'
 * ✅ User-Agent contém 'Expo' ou 'ReactNative'
 * ✅ Resultado: detectado como APP
 */
