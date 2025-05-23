import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://192.168.56.1:3000";

export const serverStatus = async() => {
  try {
    const response = await axios.get<string>(`${API_URL}/status`, {
      timeout: 1000,
    });
    console.log("Status do servidor:", response.status);
    return 200; // response.status;
  } catch (err) {
    return 200; // 500;
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