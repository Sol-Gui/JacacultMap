import { Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useServerCheck } from '../../services/api';
import { useRouter } from 'expo-router';
import { ApiErrorIcon } from "../../styles/icons";

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
    
  useEffect(() => {
    if (!shouldRedirect && !checking) {
      router.replace('/');
    }
  }, [shouldRedirect, checking, router]);

  return (
    <View className="flex-1 items-center justify-center bg-[#064E3B] px-5">
      <View className="w-full max-w-[400px] items-center rounded-2xl bg-white p-7 shadow-xl">
      <Image source={ApiErrorIcon} className="h-28 w-28" />
      <Text className="mt-5 text-center text-xl font-extrabold text-[#123C2C]">
        Conexão indisponível
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-[#5D7568]">
        Não foi possível falar com a API neste momento.
      </Text>
      <Text className="mt-5 text-center text-sm font-bold text-[#16734E]">
        Tentando novamente em {Math.round(interval / 1000)} segundos.
      </Text>
      </View>
    </View>
  );
};
