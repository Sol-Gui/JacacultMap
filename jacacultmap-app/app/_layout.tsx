import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { serverStatus } from "../services/api";
import { StatusBar } from 'expo-status-bar';
import { validateToken } from "../services/auth";


export default function RootLayout() {

  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

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
  }, []);

  useEffect(() => {
    if (checking && shouldRedirect) {
      router.replace("/(tabs)/status");
    } else if (!checking && !shouldRedirect) {
      validateToken()
        .then((response: any) => {
          console.log(response);
          if (response.success && response.token) {
            router.replace('/(tabs)/protected');
          } else {
            console.log("Token inválido ou não encontrado");
            router.replace('/')
          }
        });
    }
  }, [checking, shouldRedirect]);

  if (checking && !shouldRedirect) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
