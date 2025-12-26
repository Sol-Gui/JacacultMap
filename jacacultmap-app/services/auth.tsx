import axios from 'axios';
import Constants from 'expo-constants';
import { getData } from './localStorage';


export const API_URL = Constants.expoConfig?.extra?.apiUrl;

interface AuthResponse {
  token?: string;
  email?: string;
  success?: boolean;
  message?: string;
}

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function signInAuth(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/signin`,
      { email, password },
      axiosConfig
    );

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Erro ao fazer login';
    throw new Error(message);
  }
}

export async function signUpAuth(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/signup`,
      { name, email, password },
      axiosConfig
    );

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Erro ao criar conta';
    throw new Error(message);
  }
}

export async function validateToken(): Promise<AuthResponse> {
  try {
    const token = await getData('userToken');
    if (!token) {
      return { success: false, message: 'Token não encontrado' };
    }

    const response = await axios.get<AuthResponse>(`${API_URL}/tokenValidation`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Erro ao validar token'
    };
  }
}

export async function startGoogleAuth(): Promise<string> {
  try {
    const response = await axios.get<{ url: string }>(
      `${API_URL}/auth/google`,
      { ...axiosConfig, withCredentials: true }
    );
    return response.data.url;
  } catch (error: any) {
    console.error('Erro ao iniciar autenticação do Google:', error?.response?.data || error?.message);
    throw new Error(error?.response?.data?.message || 'Erro ao iniciar autenticação do Google');
  }
}

export async function useGoogleCode(code: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/google/useCode`,
      { code },
      axiosConfig
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao usar código do Google:', error?.response?.data || error?.message);
    throw new Error(error?.response?.data?.message || 'Erro ao usar código do Google');
  }
}