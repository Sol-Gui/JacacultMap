import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { validateToken } from '../../services/auth';
import { router } from 'expo-router';
import { removeData } from "../../services/localStorage";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  //removeData('userToken'); // Limpa o token para testes

  useEffect(() => {
    validateToken()
      .then((response) => {
        if (!response.success || !response.token) {
          console.log("Token inválido ou não encontrado");
          removeData('userToken'); // Limpa o token se inválido
          router.replace('/(auth)/login');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.replace('/(auth)/login')
        removeData('userToken'); // Limpa o token em caso de erro
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>
        Página segura!
      </Text>
      <Text style={styles.lepo}>Acesso garantido</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#BBBBBB',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
