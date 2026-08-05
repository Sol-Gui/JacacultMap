import { Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useServerCheck } from '../../services/api';
import { useRouter } from 'expo-router';
import { ApiErrorIcon } from "../../styles/icons";
import { useStatusStyles } from "../../styles/status";

const INITIAL_INTERVAL = 3000;
const MAX_INTERVAL = 10000;

export default function Status() {
  const router = useRouter();
  const [pollingCount, setPollingCount] = useState(0);
  const [interval, setInterval] = useState(INITIAL_INTERVAL);
  const responsiveStyles = useStatusStyles();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPollingCount(c => c + 1);
      setInterval(i => Math.min(i * 1.5, MAX_INTERVAL));
    }, interval);

    return () => clearTimeout(timeoutId);
  }, [pollingCount, interval]);

  const { shouldRedirect, checking } = useServerCheck(pollingCount);
    
  useEffect(() => {
    if (!shouldRedirect && !checking) {
      router.replace('/');
    }
  }, [shouldRedirect, checking, router]);

  return (
    <View style={responsiveStyles.body}>
      <Image source={ApiErrorIcon} style={responsiveStyles.icon}></Image>
      <Text style={responsiveStyles.error_text}>ERRO INESPERADO</Text>
      <Text style={responsiveStyles.checking_text}>
        Encontramos um erro inesperado e não conseguimos
        chamar a nossa API corretamente. 
      </Text>
      <Text style={responsiveStyles.trying_again_text}>
        Tentando novamente em {Math.round(interval / 1000)} segundos.
      </Text>
    </View>
  );
};