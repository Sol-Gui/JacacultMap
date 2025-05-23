import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { serverStatus } from "../services/api";

export default function RootLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      const status = await serverStatus();
      console.log("status:", status);
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
      router.push("/(tabs)/status");
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
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
