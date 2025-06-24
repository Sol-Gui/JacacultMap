import axios from "axios";
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

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

export const useServerCheck = (pollingCount = 0) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      const status = await serverStatus();
      if (status !== 200) {
        setShouldRedirect(true);
      } else {
        setChecking(false);
      }
    };

    checkServer();
  }, [pollingCount]);

  return {
    shouldRedirect,
    checking
  };
};