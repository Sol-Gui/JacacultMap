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
    const route = r.startsWith('/(tabs)') ? r : `/(tabs)${r}`;
    router.navigate(route as any);
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderTopColor: theme.border }]}>        
      <TouchableOpacity style={styles.navButton} onPress={() => go('/home')}>
        <Text style={[styles.navText, { color: isActive('/home') ? theme.primary : theme.textSecondary }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => go('/calendario')}>
        <Text style={[styles.navText, { color: isActive('/calendario') ? theme.primary : theme.textSecondary }]}>Calendario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => go('/favoritos')}>
        <Text style={[styles.navText, { color: isActive('/favoritos') ? theme.primary : theme.textSecondary }]}>Favoritos</Text>
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
  navButton: { 
    paddingHorizontal: 8, 
    paddingVertical: 4 
  },
  navText: { 
    fontSize: 14, 
    fontWeight: '800', 
    justifyContent: 'center',
    width: '100%'
  },
});

export default Footer;