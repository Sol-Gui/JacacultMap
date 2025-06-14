import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { validateToken } from '../../services/auth';
import { router } from 'expo-router';

export default function Test() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken()
      .then((response) => {
        if (!response.success || !response.token) {
          router.replace('/');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.replace('/')
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
      <Text>Página de testes</Text>
      <Text style={styles.lepo}>Página segura!</Text>
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
