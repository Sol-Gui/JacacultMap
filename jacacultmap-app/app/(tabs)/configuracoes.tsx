import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Switch } from 'react-native';
import Footer from '../../styles/app/footer';

type ConfiguracoesProps = {
  theme?: any;
  isDarkMode?: boolean;
  accentColor?: string;
  onSetDarkMode?: (value: boolean) => void;
  onChangeAccent?: (hex: string) => void;
};

const ACCENTS = {
  emerald: '#10B981',
  indigo: '#6366F1',
  orange: '#F59E0B',
  rose: '#F43F5E',
};

const Configuracoes: React.FC<ConfiguracoesProps> = ({ theme, isDarkMode, accentColor, onSetDarkMode, onChangeAccent }) => {
  const safeTheme = theme || { text: '#111827', border: '#E5E7EB', card: '#FFFFFF' };
  const safeIsDark = !!isDarkMode;
  const safeAccent = accentColor || '#10B981';
  const setDark = onSetDarkMode || (() => {});
  const changeAccent = onChangeAccent || (() => {});
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingBottom: 80 }}>
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16, color: safeTheme.text }}>Configurações</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            marginBottom: 12,
            borderColor: safeTheme.border,
            borderRadius: 8,
            backgroundColor: safeTheme.card,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', color: safeTheme.text }}>Modo escuro</Text>
          <Switch value={safeIsDark} onValueChange={setDark} thumbColor={safeAccent} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            marginBottom: 12,
            borderColor: safeTheme.border,
            borderRadius: 8,
            backgroundColor: safeTheme.card,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', color: safeTheme.text }}>Cor de destaque</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {Object.values(ACCENTS).map((hex) => (
              <TouchableOpacity
                key={hex}
                onPress={() => changeAccent(hex)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  marginRight: 10,
                  borderColor: '#fff',
                  backgroundColor: hex,
                  borderWidth: hex === safeAccent ? 2 : 0,
                }}
              />
            ))}
          </View>
        </View>
        </View>
      </ScrollView>
      <Footer theme={safeTheme} />
    </View>
  );
};

export default Configuracoes;


