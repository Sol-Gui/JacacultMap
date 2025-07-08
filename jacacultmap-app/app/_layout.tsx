import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useServerCheck } from "../services/api";
import { StatusBar } from 'expo-status-bar';
import { validateToken } from "../services/auth";
import { usePathname } from "expo-router";


export default function RootLayout() {

  const pathname = usePathname();
  const router = useRouter();

  const publicRouteList = ['/', '/register'];
  const currentMatch = publicRouteList.find(
    (route) => route.toLowerCase() === pathname.toLowerCase()
  );

  const { shouldRedirect, checking } = useServerCheck();

  useEffect(() => {
    if (checking && shouldRedirect) {
      router.replace("/(tabs)/status");
    } else if (!checking && !shouldRedirect) {
      validateToken()
        .then((response) => {
          if (response.success && response.token) {
            router.replace('/(tabs)/protected');
          } else if (!currentMatch) {
            router.replace('/');
          }
        })
        .catch((error) => {
          if (!currentMatch) {
            router.replace('/');
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
