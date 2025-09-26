import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../../styles/app/header';
import Footer from '../../styles/app/footer';
import { baseLight, baseDark } from '../../styles/app/mainPage';
import { saveData, getData } from '../../services/localStorage';

const Configuracoes: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#10B981');
  
  const theme = isDarkMode 
    ? { ...baseDark, primary: accentColor } 
    : { ...baseLight, primary: accentColor };

  const loadTheme = async () => {
    try {
      const storedDarkMode = await getData('isDarkMode');
      if (storedDarkMode !== null) {
        setIsDarkMode(storedDarkMode === 'true'); 
      }
    } catch (err) {
      console.error('Erro ao carregar tema:', err);
    }
  };

  // 🔹 Alternar e salvar estado
  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await saveData('isDarkMode', String(newMode));
    } catch (err) {
      console.error('Erro ao salvar tema:', err);
    }
  };

  loadTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        onMenuPress={() => {}} 
        theme={theme}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />
      <ScrollView style={styles.mainContent}>
        {/* Configurações content */}
      </ScrollView>
      <Footer theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16
  }
});

export default Configuracoes;
