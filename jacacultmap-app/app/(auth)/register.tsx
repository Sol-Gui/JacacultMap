import { Text, View, Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SocialLoginButton, SocialLoginContainer, styles } from "../../styles/login";
import { Input, InputContainer } from "../../styles/login";
import { GoogleIcon, FacebookIcon } from "../../styles/icons";
import { FlatList, TouchableOpacity} from "react-native";
import { saveData } from "../../services/localStorage";
import { signUpAuth, startGoogleAuth } from "../../services/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { verticalScale } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { getRegisterData } from "../../utils/registerBuffer";
import * as Linking from 'expo-linking';


const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
const basicImageB64 = "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";

export default function Register() {
  const initialData = getRegisterData();

  const router = useRouter();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (initialData.email) setEmail(initialData.email);
    if (initialData.senha) setSenha(initialData.senha);
  }, []);


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
    <View style={styles.body}>
      <Text style={styles.title}>Novo Usuário</Text>

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
          />
        )}
          <Input
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          secureTextEntry={false}
          />
          <Input
          placeholder="Email"
          value={email}
          onChangeText={handleChange}
          secureTextEntry={false}
          />
          <Input
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            >
          <MaterialCommunityIcons 
            name={showPassword ? "eye-off" : "eye"} 
            size={verticalScale(15)} 
            color="grey"
        />
        </TouchableOpacity>
      </InputContainer>

      <TouchableOpacity
        onPress={async () => {
          try {
            const response = await signUpAuth(nome, email, senha);
            if (response.success && response.token) {
                saveData('userToken', response.token);
                saveData('userImageB64', basicImageB64);
                setError(null);
                router.replace('/(tabs)/home');
            }
          } catch (err: any) {
            showError(err.message);
          }
        }}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>Cadastrar</Text>
      </TouchableOpacity>

      <ErrorPopup error={error} fadeAnim={fadeAnim} />

    </View>
  );
}