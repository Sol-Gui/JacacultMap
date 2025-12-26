import { Text, View, Animated, ScrollView } from "react-native";
import React, { useState, useRef } from "react";
import { 
  SocialLoginButton, 
  SocialLoginContainer, 
  styles, 
  PasswordInput, 
  Input, 
  InputContainer, 
  Divider,
  LoginContainer,
  LoginTitle,
  LoginSubtitle,
  LoginButton,
  ForgotPasswordLink
} from "../../styles/login";
import { GoogleIcon, FacebookIcon } from "../../styles/icons";
import { FlatList, TouchableOpacity} from "react-native";
import { saveData } from "../../services/localStorage";
import { signInAuth, startGoogleAuth } from "../../services/auth";
import { useRouter } from "expo-router";
import { setRegisterData } from "../../utils/registerBuffer";
import { getUserData } from '../../services/user';
import * as Linking from 'expo-linking';

const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

export default function login() {
  const router = useRouter();

  
  /* 

  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!

  */

  /*

  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!
  REMOVER APENAS PARA TESTES!!!!!

  */


  const [showSuggestions, setShowSuggestions] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showError = (msg: string) => {
    setError(msg);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setError(null));
      }, 2500);
    });
  };

  const handleChange = (text: string) => {
    setEmail(text);
    setShowSuggestions(text.endsWith('@'));
  };

  const handleSelect = (domain: string) => {
    setEmail(email + domain);
    setShowSuggestions(false);
  };

  function ErrorPopup({ error, fadeAnim }: { error: string | null, fadeAnim: Animated.Value }) {
    if (!error) return null;
    return (
      <Animated.View style={[styles.errorPopup, { opacity: fadeAnim }]}> 
        <Text style={[styles.errorText, { fontFamily: 'monospace' }]}>{error}</Text>
      </Animated.View>
    );
  }

  return (
    <LoginContainer>
      <ScrollView 
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <LoginTitle>SEJA BEM VINDO</LoginTitle>
        <LoginSubtitle>Efetue seu login</LoginSubtitle>

        <SocialLoginContainer>
          <SocialLoginButton
            onPress={async () => {
              const response = await startGoogleAuth();
              await Linking.openURL(response);
            }}
            icon={GoogleIcon}
          />

          <SocialLoginButton
            onPress={() => {
              console.log('Lógica de login com Facebook aqui...');
            }}
            icon={FacebookIcon}
          />
        </SocialLoginContainer>

        <Divider />
        
        <InputContainer>
          {showSuggestions && (
            <FlatList
              data={emailDomains}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{email + item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
              keyExtractor={(item) => item}
              scrollEnabled={false}
            />
          )}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={handleChange}
            secureTextEntry={false}
          />
          <PasswordInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </InputContainer>

        <ForgotPasswordLink onPress={() => console.log("Pressionou o botão!")} />

        <LoginButton 
          isPrimary={true}
          onPress={async () => {
            try {
              const response = await signInAuth(email, senha)
              
               if (response.success && response.token) {
                saveData('userToken', response.token);
                const userData: any = await getUserData(response.token);
                if (userData.userData.favoritedCategories != undefined && userData.userData.favoritedCategories.length == 0) {
                  router.replace('/(tabs)/interests');
                } else {
                  router.replace('/(tabs)/home');
                }
              }
            } catch (err: any) {
              showError(err.message);
            }
          }}
        >
          Acessar
        </LoginButton>

        <LoginButton
          isPrimary={false}
          onPress={async () => {
            try {
              setRegisterData({email, senha});
              router.push({
                pathname: '/register',
              });
            } catch (err: any) {
              showError(err.message);
            }
          }}
        >
          Cadastre-se
        </LoginButton>

        <ErrorPopup error={error} fadeAnim={fadeAnim}/>
      </ScrollView>
    </LoginContainer>
  );
}