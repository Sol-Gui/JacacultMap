import { Link, Stack } from 'expo-router';
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center px-5 py-5">
        <Text className="mb-3 text-center text-2xl font-bold text-[#333] md:text-3xl">This screen doesn't exist.</Text>
        <Link href="/" className="items-center justify-center">
          <Text className="px-5 py-4 text-base font-semibold text-[#2686ff] underline md:text-lg">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
