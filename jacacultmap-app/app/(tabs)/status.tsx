  import { StyleSheet } from 'react-native';
  import { Text, View } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useServerCheck } from '../../services/api';
  import { useRouter } from 'expo-router';

  const INITIAL_INTERVAL = 3000;
  const MAX_INTERVAL = 10000;

  export default function Status() {
    const router = useRouter();
    const [pollingCount, setPollingCount] = useState(0);
    const [interval, setInterval] = useState(INITIAL_INTERVAL);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setPollingCount(c => c + 1);
        setInterval(i => Math.min(i * 1.5, MAX_INTERVAL));
      }, interval);

      return () => clearTimeout(timeoutId);
    }, [pollingCount, interval]);

    const { shouldRedirect, checking } = useServerCheck(pollingCount);
    console.log('Status:', { shouldRedirect, checking, interval, pollingCount });
    
    useEffect(() => {
      if (!shouldRedirect && !checking) {
        router.replace('/');
      }
    }, [shouldRedirect, checking, router]);

    return (
      <View>
        <Text>Página de testes</Text>
        <Text style={styles.lepo}>
          Servidor offline... Checando novamente em {Math.round(interval / 1000)}s
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    lepo: {
      color: '#FF0000',
    },
  });