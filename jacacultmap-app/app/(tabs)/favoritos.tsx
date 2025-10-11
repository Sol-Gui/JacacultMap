import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../../styles/app/header';
import Footer from '../../styles/app/footer';
import { useTheme } from '../../contexts/ThemeContext';

const Favoritos: React.FC = () => {
  const { theme, isDarkMode, toggleDarkMode, isLoading } = useTheme();

  if (isLoading) {
    return null; // ou um loading spinner
  }
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

export default Favoritos;
