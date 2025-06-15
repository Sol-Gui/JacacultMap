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
      console.log("Server status:", status);
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
        .then((response) => {
          console.log("Token validation response:", response);
          // Ignore validation result and always redirect to protected route
          router.replace('/(tabs)/protected');
        })
        .catch((error) => {
          console.log("Token validation error ignored:", error);
          router.replace('/');
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
