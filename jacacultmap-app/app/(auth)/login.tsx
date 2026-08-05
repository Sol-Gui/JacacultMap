import React, { useRef, useState } from 'react';
import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import {
  AuthLayout,
  AuthLink,
  AuthSubtitle,
  AuthTitle,
  Divider,
  ErrorBanner,
  Input,
  PasswordInput,
  PrimaryButton,
  SecondaryButton,
  SocialLoginButton,
} from '../../components/AuthUI';
import { GoogleIcon } from '../../styles/icons';
import { saveData } from '../../services/localStorage';
import { signInAuth, startGoogleAuth } from '../../services/auth';
import { getUserData } from '../../services/user';
import { setRegisterData } from '../../utils/registerBuffer';

const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showError = (message: string) => {
    setError(message);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setShowSuggestions(value.endsWith('@'));
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      showError('Informe seu e-mail e sua senha para continuar.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await signInAuth(email.trim(), senha);

      if (!response.success || !response.token) {
        showError('Não foi possível entrar. Verifique suas credenciais.');
        return;
      }

      await saveData('userToken', response.token);
      const userData: any = await getUserData(response.token);
      const categories = userData?.userData?.favoritedCategories;
      router.replace(Array.isArray(categories) && categories.length === 0 ? '/(tabs)/interests' : '/(tabs)/home');
    } catch (err: any) {
      showError(err?.message || 'Não foi possível entrar agora. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(true);
      const url = await startGoogleAuth();
      await Linking.openURL(url);
    } catch (err: any) {
      showError(err?.message || 'Não foi possível iniciar o login com Google.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScrollView className="w-full" contentContainerClassName="pb-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <AuthTitle>Boas-vindas de volta</AuthTitle>
        <AuthSubtitle>Acesse sua conta para encontrar novos eventos.</AuthSubtitle>

        <SocialLoginButton onPress={handleGoogleLogin} icon={GoogleIcon} loading={socialLoading}>
          Continuar com Google
        </SocialLoginButton>

        <Divider />

        <View className="relative">
          <Input
            label="E-mail"
            placeholder="voce@exemplo.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {showSuggestions && (
            <FlatList
              data={emailDomains}
              keyExtractor={(item) => item}
              className="absolute left-0 right-0 top-[76px] z-20 rounded-xl border border-[#CFE3D5] bg-white"
              renderItem={({ item }) => (
                <TouchableOpacity className="border-b border-[#E6F0E9] px-3.5 py-2.5 last:border-b-0" onPress={() => { setEmail(`${email}${item}`); setShowSuggestions(false); }}>
                  <Text className="text-sm font-medium text-[#17613F]">{email}{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <PasswordInput
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((current) => !current)}
          />
        </View>

        <AuthLink onPress={() => showError('A recuperação de senha ainda não está disponível.')}>Esqueci minha senha</AuthLink>
        <PrimaryButton onPress={handleLogin} loading={submitting}>Entrar</PrimaryButton>
        <SecondaryButton onPress={() => { setRegisterData({ email, senha }); router.push('/(auth)/register'); }}>Criar uma conta</SecondaryButton>

        {error && <Animated.View style={{ opacity: fadeAnim }}><ErrorBanner message={error} /></Animated.View>}
      </ScrollView>
    </AuthLayout>
  );
}
