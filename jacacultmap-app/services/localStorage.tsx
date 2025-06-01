import * as SecureStore from 'expo-secure-store';

export async function saveData(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
        console.log(`Data saved: ${key} = ${value}`);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

export async function getData(key: string): Promise<string | null> {
    try {
        const value = await SecureStore.getItemAsync(key);
        console.log(`Data retrieved: ${key} = ${value}`);
        return value;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
}

export async function removeData(key: string) {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log(`Data removed: ${key}`);
    } catch (error) {
        console.error('Error removing data:', error);
    }
}