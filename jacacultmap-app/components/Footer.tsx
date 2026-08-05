import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';

type FooterProps = {
  theme: any;
};

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (r: string) => pathname === r || pathname === `/(tabs)${r}`;
  
  const go = (r: string) => {
    const route = r.startsWith('/(tabs)') ? r : `/(tabs)${r}`;
    router.navigate(route as any);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 z-30 flex-row items-center justify-around border-t px-2 pb-4 pt-2"
      style={{ backgroundColor: theme.card, borderTopColor: theme.border }}
    >
      <TouchableOpacity className="min-w-[78px] items-center gap-1 rounded-xl px-2 py-1.5" style={isActive('/home') ? { backgroundColor: `${theme.primary}18` } : undefined} onPress={() => go('/home')} accessibilityLabel="Início">
        <Feather name="home" size={19} color={isActive('/home') ? theme.primary : theme.textSecondary} />
        <Text className="text-[11px] font-bold" style={{ color: isActive('/home') ? theme.primary : theme.textSecondary }}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity className="min-w-[78px] items-center gap-1 rounded-xl px-2 py-1.5" style={isActive('/calendario') ? { backgroundColor: `${theme.primary}18` } : undefined} onPress={() => go('/calendario')} accessibilityLabel="Calendário">
        <Feather name="calendar" size={19} color={isActive('/calendario') ? theme.primary : theme.textSecondary} />
        <Text className="text-[11px] font-bold" style={{ color: isActive('/calendario') ? theme.primary : theme.textSecondary }}>Calendário</Text>
      </TouchableOpacity>
      <TouchableOpacity className="min-w-[78px] items-center gap-1 rounded-xl px-2 py-1.5" style={isActive('/favoritos') ? { backgroundColor: `${theme.primary}18` } : undefined} onPress={() => go('/favoritos')} accessibilityLabel="Favoritos">
        <Feather name="heart" size={19} color={isActive('/favoritos') ? theme.primary : theme.textSecondary} />
        <Text className="text-[11px] font-bold" style={{ color: isActive('/favoritos') ? theme.primary : theme.textSecondary }}>Favoritos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
