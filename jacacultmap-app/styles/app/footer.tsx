import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

type FooterProps = {
  theme: any;
};

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (r: string) => pathname === r || pathname === `/(tabs)${r}`;
  const go = (r: string) => {
    router.replace(r.startsWith('/(tabs)') ? (r as any) : (`/(tabs)${r}` as any));
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderTopColor: theme.border }]}>        
      <TouchableOpacity style={styles.navButton} onPress={() => go('/test')}>
        <Text style={[styles.navText, { color: isActive('/test') ? theme.primary : theme.textSecondary }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => go('/novidades')}>
        <Text style={[styles.navText, { color: isActive('/novidades') ? theme.primary : theme.textSecondary }]}>Novidades</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => go('/configuracoes')}>
        <Text style={[styles.navText, { color: isActive('/configuracoes') ? theme.primary : theme.textSecondary }]}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  navButton: { paddingHorizontal: 8, paddingVertical: 4 },
  navText: { fontSize: 14, fontWeight: '700' },
});

export default Footer;


