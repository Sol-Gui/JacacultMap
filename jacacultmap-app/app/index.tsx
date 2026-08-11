// app/index.tsx
import { View, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
