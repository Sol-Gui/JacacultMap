import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Usa SecureStore no app nativo e cookies no web
const isWeb = Platform.OS === 'web';
// Tempo de vida do cookie em dias (equivalente à persistência do SecureStore)
const COOKIE_MAX_AGE_DAYS = 30;

// Grava um cookie codificando chave/valor para não quebrar com ';' ou '='
function setCookie(key: string, value: string) {
  if (typeof document === 'undefined') return; // proteção para SSR (sem DOM)

  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // dias -> segundos
  // Só marca "Secure" se a página estiver em HTTPS, senão o cookie não seria salvo
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

// Lê um cookie pelo nome, procurando no document.cookie inteiro
function getCookie(key: string): string | null {
  if (typeof document === 'undefined') return null;

  // document.cookie retorna tudo junto, ex: "a=1; b=2; c=3" — precisa separar e achar o par certo
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(key)}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

// Remove um cookie zerando o max-age (não existe document.cookie.delete)
function deleteCookie(key: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0`;
}

export async function saveData(key: string, value: string) {
  try {
    if (isWeb) {
      // No web, usa cookie diretamente
      setCookie(key, value);
    } else {
      // No app, usa SecureStore para dados sensíveis como tokens
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export async function getData(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      // No web, usa cookie diretamente
      return getCookie(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

export async function removeData(key: string) {
  try {
    if (isWeb) {
      // No web, usa cookie diretamente
      deleteCookie(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error('Error removing data:', error);
  }
}