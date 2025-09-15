import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import Footer from '../../styles/app/footer';

type NovidadesProps = {
  theme?: any;
};

const newsData = [
  { id: 1, title: 'Festival de Arte Moderna' },
  { id: 2, title: 'Nova Exposição no Museu' },
  { id: 3, title: 'Workshop de Fotografia' },
  { id: 4, title: 'Concerto de Música Clássica' },
  { id: 5, title: 'Teatro ao Ar Livre' },
];

const Novidades: React.FC<NovidadesProps> = ({ theme }) => {
  const safeTheme = theme || { text: '#111827', border: '#E5E7EB', card: '#FFFFFF' };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingBottom: 80 }}>
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16, color: safeTheme.text }}>
            Todas as novidades
          </Text>
          {newsData.map((n) => (
            <View
              key={n.id}
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                marginBottom: 12,
                borderColor: safeTheme.border,
                backgroundColor: safeTheme.card,
              }}
            >
              <Text style={{ color: safeTheme.text }}>{n.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <Footer theme={safeTheme} />
    </View>
  );
};

export default Novidades;


