import { Text, View, Animated } from "react-native";
import React, { useState, useRef } from "react";
import { SocialLoginButton, SocialLoginContainer, styles } from "../styles/login";
import { Input, InputContainer } from "../styles/login";
import { GoogleIcon, FacebookIcon } from "../styles/icons";
import { FlatList, TouchableOpacity} from 'react-native';
//import { removeData, saveData, getData } from "../../services/localStorage";
import { signInAuth, signUpAuth } from "../services/auth";


const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];


export default function login() {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeSuccess = useRef(new Animated.Value(0)).current;

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

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    Animated.timing(fadeSuccess, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeSuccess, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setSuccess(null));
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

  function SuccessPopup({ success, fadeAnim }: { success: string | null, fadeAnim: Animated.Value }) {
    if (!success) return null;
    return (
      <Animated.View style={[styles.successPopup, { opacity: fadeAnim }]}> 
        <Text style={[styles.successText, { fontFamily: 'monospace' }]}>{success}</Text>
      </Animated.View>
    );
  }


  return (
    <View style={styles.body}>
      <Text style={styles.title}>SEJA BEM VINDO</Text>
      <Text style={styles.text}>Efetue seu login</Text>

      <SocialLoginContainer>
        <SocialLoginButton
          onPress={() => {
            console.log("Lógica de login com Google aqui...");	
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
          placeholder="Email"
          value={email}
          onChangeText={handleChange}
          />
          <Input
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          />
      </InputContainer>

      <TouchableOpacity onPress={() => console.log("Pressionou o botão!")}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signInAuth(email, senha)} style={styles.loginButton}>
        <Text style={styles.loginText}>Acessar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={async () => {
        try {
          const result = await signUpAuth(email, senha);
          setError(null);
          showSuccess(result.message || 'Usuário criado com sucesso!');
        } catch (err: any) {
          showError(err.message);
        }
      }} style={styles.registerButton}>
        <Text style={styles.registerText}>Cadastre-se</Text>
      </TouchableOpacity>

      <ErrorPopup error={error} fadeAnim={fadeAnim} />
      <SuccessPopup success={success} fadeAnim={fadeSuccess} />

    </View>
  );
}