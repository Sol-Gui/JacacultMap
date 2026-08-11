import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import {
  AuthLayout,
  SecondaryButton,
  AuthSubtitle,
  AuthTitle,
  Divider,
  ErrorBanner,
  Input,
  PasswordInput,
  PrimaryButton,
  SocialLoginButton,
} from '../../components/AuthUI';
import { GoogleIcon } from '../../styles/icons';
import { saveData } from '../../services/localStorage';
import { signUpAuth, startGoogleAuth } from '../../services/auth';
import { getRegisterData } from '../../utils/registerBuffer';

const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com'];

export default function Register() {
  const router = useRouter();
  const initialData = getRegisterData();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setEmail(initialData.email);
    setSenha(initialData.senha);
  }, [initialData.email, initialData.senha]);

  const showError = (message: string) => {
    setError(message);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      showError('Preencha nome, e-mail e senha para criar sua conta.');
      return;
    }

    if (senha.length < 6) {
      showError('Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await signUpAuth(nome.trim(), email.trim(), senha);

      if (!response.success || !response.token) {
        showError('Não foi possível criar sua conta. Tente novamente.');
        return;
      }

      await saveData('userToken', response.token);
      router.replace('/(tabs)/interests');
    } catch (err: any) {
      showError(err?.message || 'Não foi possível criar sua conta agora.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setSocialLoading(true);
      const url = await startGoogleAuth();
      await Linking.openURL(url);
    } catch (err: any) {
      showError(err?.message || 'Não foi possível iniciar o cadastro com Google.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScrollView className="w-full" contentContainerClassName="pb-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <AuthTitle>Crie sua conta</AuthTitle>
        <AuthSubtitle>Escolha seus interesses e acompanhe os eventos que importam.</AuthSubtitle>

        <SocialLoginButton onPress={handleGoogleRegister} icon={GoogleIcon} loading={socialLoading}>
          Cadastrar com Google
        </SocialLoginButton>

        <Divider />

        <View className="relative">
          <Input
            label="Nome"
            placeholder="Como podemos te chamar?"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
          <Input
            label="E-mail"
            placeholder="voce@exemplo.com"
            value={email}
            onChangeText={(value) => { setEmail(value); setShowSuggestions(value.endsWith('@')); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {showSuggestions && (
            <FlatList
              data={emailDomains}
              keyExtractor={(item) => item}
              className="absolute left-0 right-0 top-[158px] z-20 rounded-xl border border-[#CFE3D5] bg-white"
              renderItem={({ item }) => (
                <TouchableOpacity className="border-b border-[#E6F0E9] px-3.5 py-2.5 last:border-b-0" onPress={() => { setEmail(`${email}${item}`); setShowSuggestions(false); }}>
                  <Text className="text-sm font-medium text-[#17613F]">{email}{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <PasswordInput
            label="Senha"
            placeholder="Mínimo de 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((current) => !current)}
          />
        </View>

        <PrimaryButton onPress={handleRegister} loading={submitting}>Criar conta</PrimaryButton>
        <SecondaryButton onPress={() => { router.push('/(auth)/login'); }}>Já tenho uma conta</SecondaryButton>

        {error && <Animated.View style={{ opacity: fadeAnim }}><ErrorBanner message={error} /></Animated.View>}
      </ScrollView>
    </AuthLayout>
  );
}
