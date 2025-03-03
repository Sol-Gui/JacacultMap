import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://10.0.0.199:3000"; // Altere para o IP correto

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