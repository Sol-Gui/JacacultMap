import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useServerCheck } from "../services/api";
import { StatusBar } from 'expo-status-bar';
import { validateToken } from "../services/auth";
import { usePathname } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { UserProvider } from "../contexts/UserContext";
import { removeData } from "../services/localStorage";
import { getUserData } from '../services/user';


export default function RootLayout() {

  const pathname = usePathname();
  const router = useRouter();

  const publicRouteList = [
    '/login', 
    '/register', 
    '/auth-callback',
  ];
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
            getUserData(response.token).then((userData) => {
              if (userData.userData.favoritedCategories != undefined && userData.userData.favoritedCategories.length == 0) {
                router.replace('/(tabs)/interests');
              } else {
                router.replace('/(tabs)/home');
              }
            });
          } else if (!currentMatch) {
            console.log("data removida");
            removeData('userToken');
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
      <UserProvider>
        <StatusBar hidden />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
}
