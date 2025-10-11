import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl

export async function getUserData(token: string) {
  try {
    const response = await axios.get(`${API_URL}/get-user-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function updateUserData(token: string, userData: Record<string, any>) {
  try {
    const response = await axios.post(`${API_URL}/update-user-data`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}