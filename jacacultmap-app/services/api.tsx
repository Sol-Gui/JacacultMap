import axios from "axios";
import Constants from 'expo-constants';


const API_URL = Constants.expoConfig?.extra?.apiUrl

export const serverStatus = async() => {
  try {
    const response = await axios.get<string>(`${API_URL}/status`, {
      timeout: 1000,
    });
    console.log("Status do servidor:", response.status);
    return response.status; // response.status;
  } catch (err) {
    return 500; // 500;
  }
}