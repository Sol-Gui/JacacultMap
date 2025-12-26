import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Usa SecureStore no app nativo e localStorage no web
const isWeb = Platform.OS === 'web';

export async function saveData(key: string, value: string) {
    try {
        if (isWeb) {
            // No web, usa localStorage diretamente
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
            }
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
            // No web, usa localStorage diretamente
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
            return null;
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
            // No web, usa localStorage diretamente
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error('Error removing data:', error);
    }
}