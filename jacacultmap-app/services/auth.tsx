import axios from 'axios';
import Constants from 'expo-constants';
const { getData } = require('localStorage');

const API_URL = Constants.expoConfig?.extra?.apiUrl;

interface AuthResponse {
  token?: string;
  email?: string;
  success?: boolean;
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

export async function signUpAuth(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/signup`,
      { email, password },
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
    const response = await axios.get<AuthResponse>(`${API_URL}/tokenValidation`,
      {
        headers: {
          'Authorization': `Bearer ${await getData('userToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Erro ao fazer auto login';
    throw new Error(message);
  }
}
