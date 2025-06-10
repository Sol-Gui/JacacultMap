import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { serverStatus } from "../services/api";
import { StatusBar } from 'expo-status-bar';


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
      router.replace("/");
    } else if (!checking && !shouldRedirect) {
      router.replace("/");
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
