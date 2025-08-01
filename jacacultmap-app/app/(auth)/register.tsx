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
                setError(null);
                router.replace('/(tabs)/protected');
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