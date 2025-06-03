import { Text, View } from "react-native";
import React, { useState } from "react";
import { SocialLoginButton, SocialLoginContainer, styles } from "../../styles/login";
import { Input, InputContainer } from "../../styles/login";
import { GoogleIcon, FacebookIcon } from "../../styles/icons";
import { FlatList, TouchableOpacity} from 'react-native';
//import { removeData, saveData, getData } from "../../services/localStorage";
import { signInAuth, signUpAuth } from "../../services/auth";


const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];


export default function login() {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  

  const handleChange = (text: string) => {
    setEmail(text);
    setShowSuggestions(text.endsWith('@'));
  };

  const handleSelect = (domain: string) => {
    setEmail(email + domain);
    setShowSuggestions(false);
  };


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

      <TouchableOpacity onPress={() => signUpAuth(email, senha)} style={styles.registerButton}>
        <Text style={styles.registerText}>Cadastre-se</Text>
      </TouchableOpacity>

    </View>
  );
}