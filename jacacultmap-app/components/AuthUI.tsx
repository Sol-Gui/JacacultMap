import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView className="flex-1 bg-[#006032] w-full" edges={['top', 'left', 'right', 'bottom']}>
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View className="flex-1 px-5 pt-8 sm:px-8 sm:pt-10 bg-[#006032]">
        <View className="mx-auto w-full max-w-[460px]">
          <Text className="text-3xl font-extrabold text-white">JacaCultMap</Text>
          <View className="mt-2 h-1 w-12 rounded-full bg-[#81B522]" />
          <Text className="mt-3 text-sm leading-5 text-[#D9ECD2]">Seu ponto de encontro com a cultura local.</Text>
        </View>
        <View className="flex-1 flex justify-top items-center">
        <View className="w-full h-auto px-5 py-10 rounded-[50px] bg-[#F7FAF6] sm:w-[70%] my-10">
          <View className="mx-auto w-full max-w-[460px]">
            {children}
          </View>
        </View>
      </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export const AuthTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-2xl font-extrabold text-[#123C2C]">{children}</Text>
);

export const AuthSubtitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="mb-6 mt-1 text-sm leading-5 text-[#5D7568]">{children}</Text>
);

export const SocialLoginButton = ({
  onPress,
  icon,
  children,
  loading = false,
}: {
  onPress: () => void;
  icon: any;
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <TouchableOpacity
    className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-[#C9DDCF] bg-white px-4"
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
    accessibilityRole="button"
  >
    {loading ? <ActivityIndicator color="#006032" /> : <Image source={icon} style={{ width: 18, height: 18 }} resizeMode="contain" />}
    <Text className="text-sm font-bold text-[#1D4D38]">{children}</Text>
  </TouchableOpacity>
);

export const Divider = () => (
  <View className="my-6 flex-row items-center">
    <View className="h-px flex-1 bg-[#D5E4D9]" />
    <Text className="mx-3 text-xs font-bold text-[#789084]">OU</Text>
    <View className="h-px flex-1 bg-[#D5E4D9]" />
  </View>
);

type InputProps = TextInputProps & {
  label: string;
};

export const Input = ({ label, ...props }: InputProps) => (
  <View className="mb-4">
    <Text className="mb-1.5 text-sm font-bold text-[#315847]">{label}</Text>
    <TextInput
      className="h-12 w-full rounded-xl border border-[#C9DDCF] bg-white px-3.5 text-base text-[#173D2D]"
      placeholderTextColor="#789084"
      {...props}
    />
  </View>
);

type PasswordInputProps = Omit<InputProps, 'secureTextEntry'> & {
  showPassword: boolean;
  onTogglePassword: () => void;
};

export const PasswordInput = ({
  label,
  showPassword,
  onTogglePassword,
  ...props
}: PasswordInputProps) => (
  <View className="mb-2">
    <Text className="mb-1.5 text-sm font-bold text-[#315847]">{label}</Text>
    <View className="relative">
      <TextInput
        className="h-12 w-full rounded-xl border border-[#C9DDCF] bg-white px-3.5 pr-12 text-base text-[#173D2D]"
        placeholderTextColor="#789084"
        secureTextEntry={!showPassword}
        {...props}
      />
      <TouchableOpacity
        className="absolute right-1 top-0 h-12 w-11 items-center justify-center"
        onPress={onTogglePassword}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color="#4E725F" />
      </TouchableOpacity>
    </View>
  </View>
);

export const PrimaryButton = ({
  onPress,
  children,
  loading = false,
}: {
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <TouchableOpacity
    className="mt-5 h-12 w-full items-center justify-center rounded-xl bg-[#006032] px-4"
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.85}
    accessibilityRole="button"
  >
    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-sm font-extrabold text-white">{children}</Text>}
  </TouchableOpacity>
);

export const SecondaryButton = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity
    className="mt-3 h-12 w-full items-center justify-center rounded-xl border border-[#8FC4A1] bg-transparent px-4"
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
  >
    <Text className="text-sm font-extrabold text-[#17613F]">{children}</Text>
  </TouchableOpacity>
);

export const AuthLink = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity className="mt-4 self-center px-2 py-1" onPress={onPress} accessibilityRole="button">
    <Text className="text-sm font-bold text-[#17613F]">{children}</Text>
  </TouchableOpacity>
);

export const ErrorBanner = ({ message }: { message: string }) => (
  <View className="mt-4 rounded-xl border border-[#F2B8B5] bg-[#FFF4F3] px-3 py-2.5">
    <Text className="text-center text-sm font-semibold text-[#A5302A]">{message}</Text>
  </View>
);
