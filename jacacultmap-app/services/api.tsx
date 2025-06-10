import axios from "axios";
import { useEffect, useState } from "react";
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

export const getMessage = async (route?: string): Promise<string | null> => {
  try {
    const url = route ? `${API_URL}/${route}` : `${API_URL}/`;  
    const response = await axios.get<string>(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

export const useMessage = (route?: string): string => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await getMessage(route);
      if (data) {
        setMessage(data);
      } else {
        console.log("Nenhuma mensagem recebida");
      }
    };

    fetchMessage();
  }, [route]);

  return message;
};