import { StyleSheet } from 'react-native';
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useServerCheck } from '../../services/api';
import { useRouter } from 'expo-router';

// Polling fora do componente
let reloads = 1;

export default function Status() {
  const router = useRouter();
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    const scheduleNext = () => {
      setTimeout(() => {
        reloads++;
        setPollingCount(c => c + 1);
        scheduleNext();
      }, 3000 * reloads);
    };

    scheduleNext();
  }, []);

  const { shouldRedirect, checking } = useServerCheck(pollingCount);
  console.log(shouldRedirect, checking, reloads);
  
  useEffect(() => {
    if (!shouldRedirect && !checking) {
      router.replace('/');
    }
  }, [shouldRedirect, checking, router]);

  return (
    <View>
      <Text>Página de testes</Text>
      <Text style={styles.lepo}>
        Servidor offline... Checando novamente em {3 * reloads}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#FF0000',
  },
});