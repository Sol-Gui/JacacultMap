import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';
import { removeData, saveData, getData } from "../../services/localStorage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { validateToken, useGoogleCode } from '../../services/auth'
import { getUserData } from '../../services/user';

async function processGoogleCode(code: string) {
  try {
    const response = await useGoogleCode(String(code));
    
    if (response.success && response.token && response.token.length > 0) {
      await saveData('userToken', response.token);
      return true;
    } else {
      console.error('Token não recebido');
      return false;
    }
  } catch (error) {
    console.error('Erro ao processar código:', error);
    return false;
  }
}

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const processAuth = async () => {
      try {
        // Tenta pegar o código dos query params (expo-router)
        let code: string | string[] | undefined = params?.code;
        
        // Se não tiver nos params, tenta pegar da URL inicial
        if (!code) {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            const parsed = Linking.parse(initialUrl);
            code = parsed.queryParams?.code;
          }
        }

        // Se ainda não tiver, escuta eventos de deep linking
        if (!code) {
          const subscription = Linking.addEventListener('url', ({ url }) => {
            const parsed = Linking.parse(url);
            const urlCode = parsed.queryParams?.code;
            if (urlCode) {
              processCode(urlCode);
            }
          });

          // Timeout de segurança
          setTimeout(() => {
            if (!code) {
              router.replace('/(auth)/login');
            }
          }, 3000);

          return () => {
            subscription.remove();
          };
        }

        // Processa o código encontrado
        await processCode(code);
      } catch (error) {
        console.error('Erro no processo de autenticação:', error);
        router.replace('/(auth)/login');
      }
    };

    const processCode = async (code: string | string[]) => {
      const codeStr = Array.isArray(code) ? code[0] : code;
      
      // Processa o código
      const tokenSaved = await processGoogleCode(codeStr);
      if (!tokenSaved) {
        router.replace('/(auth)/login');
        return;
      }

      // Valida o token
      const tokenResponse = await validateToken();
      if (!tokenResponse.success || !tokenResponse.token) {
        await removeData('userToken');
        router.replace('/(auth)/login');
        return;
      }

      // Verifica se precisa ir para interests ou home
      const token = await getData('userToken');
      if (!token || typeof token !== 'string') {
        router.replace('/(auth)/login');
        return;
      }
      
      const userData: any = await getUserData(token);
      
      if (userData?.userData?.favoritedCategories != undefined && userData.userData.favoritedCategories.length == 0) {
        router.replace('/(tabs)/interests');
      } else {
        router.replace('/(tabs)/home');
      }
    };

    processAuth();
  }, [router, params]);

  return null;
}