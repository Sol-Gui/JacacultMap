import * as Linking from 'expo-linking';
import { useState } from 'react';
import { removeData, saveData } from "../../services/localStorage";
import { useRouter } from "expo-router";
import { validateToken, useGoogleCode } from '../../services/auth'
import { useNavigation, CommonActions } from '@react-navigation/native';

async function processGoogleCode(code: string) {
  try {
    console.log("Processando código:", code);
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

async function checkToken() {
  try {
    const response = await validateToken();
    
    if (!response.success || !response.token) {
      await removeData('userToken');
      return false;
    }
    
    console.log("Token válido");
    return true;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    await removeData('userToken');
    return false;
  }
}

export default function AuthCallbackScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  (async () => {
    try {
      const url = Linking.getLinkingURL();
      if (!url) {
        router.replace('/(auth)/login');
        return;
      }

      const { queryParams } = Linking.parse(url);
      const code = queryParams?.code;
      
      if (!code) {
        console.error('Código não encontrado na URL');
        router.replace('/(auth)/login');
        return;
      }
      
      // Processa o código e espera finalizar
      const tokenSaved = await processGoogleCode(Array.isArray(code) ? code[0] : code);
      if (!tokenSaved) {
        router.replace('/(auth)/login');
        return;
      }

      // Valida o token e espera finalizar
      const tokenValid = await checkToken();
      if (!tokenValid) {
        router.replace('/(auth)/login');
        return;
      }

      // Se chegou aqui, tudo deu certo
      setLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: '(tabs)/protected' }],
        })
      );

      
    } catch (error) {
      console.error('Erro no processo de autenticação:', error);
      router.replace('/(auth)/login');
    }
  })();

  return null;
}