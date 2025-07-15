import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { removeData, saveData } from "../../services/localStorage";
import { useRouter } from "expo-router";
import { validateToken, useGoogleCode } from '../../services/auth';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = Linking.getInitialURL().then((url) => {
      if (url) {
        const { queryParams } = Linking.parse(url);
        const code = queryParams.code;
        console.log("Código recebido na URL:", code);

        if (code) {
          useGoogleCode(code)
            .then((token) => {
              if (token) {
                saveData('userToken', token);
              } else {
                console.error('Token não recebido');
                router.replace('/');
              }
            });
        } else {
          console.error('Código não encontrado na URL');
          router.replace('/');
        }
      }
    });
  }, []);

  useEffect(() => {
    validateToken()
    .then((response) => {
      if (!response.success || !response.token) {
        console.log("Token inválido ou não encontrado");
        removeData('userToken');
        router.replace('/');
      } else {
        setLoading(false);
        router.replace('/(tabs)/protected');
      }
    })
    .catch(() => {
      router.replace('/')
      removeData('userToken');
    });
  }, []);

  return null;
}