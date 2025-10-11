import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useServerCheck } from "../services/api";
import { StatusBar } from 'expo-status-bar';
import { validateToken } from "../services/auth";
import { usePathname } from "expo-router";
import { Tabs } from 'expo-router';
import { ThemeProvider } from "../contexts/ThemeContext";


export default function RootLayout() {

  const pathname = usePathname();
  const router = useRouter();

  const publicRouteList = ['/login', '/register', '/auth-callback', '/home', '/interests', '/calendario', '/favoritos'];
  const currentMatch = publicRouteList.find(
    (route) => route.toLowerCase() === pathname.toLowerCase()
  );

  const { shouldRedirect, checking } = useServerCheck(pathname);
  console.log(checking, shouldRedirect);

  useEffect(() => {
    console.log("\n\nverificando...");
    if (!checking && shouldRedirect) {
      router.replace("/(tabs)/status");
    } else if (!checking && !shouldRedirect) {
      validateToken()
        .then((response) => {
          if (response.success && response.token) {
            router.replace('/(tabs)/protected');
          } else if (!currentMatch) {
            router.replace('/(auth)/login');
          }
        })
        .catch((error) => {
          if (!currentMatch) {
            router.replace('/(auth)/login');
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
    <ThemeProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
