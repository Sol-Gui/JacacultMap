import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, saveData } from '../services/localStorage';
import { baseLight, baseDark } from '../styles/app/mainPage';

interface ThemeContextType {
  isDarkMode: boolean;
  accentColor: string;
  theme: any;
  toggleDarkMode: () => Promise<void>;
  setAccentColor: (color: string) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#10B981');
  const [isLoading, setIsLoading] = useState(true);

  const theme = isDarkMode 
    ? { ...baseDark, primary: accentColor } 
    : { ...baseLight, primary: accentColor };

  const loadTheme = async () => {
    try {
      setIsLoading(true);
      const storedDarkMode = await getData('isDarkMode');
      if (storedDarkMode !== null) {
        setIsDarkMode(storedDarkMode === 'true');
      }
    } catch (err) {
      console.error('Erro ao carregar tema:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await saveData('isDarkMode', String(newMode));
    } catch (err) {
      console.error('Erro ao salvar tema:', err);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const value: ThemeContextType = {
    isDarkMode,
    accentColor,
    theme,
    toggleDarkMode,
    setAccentColor,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
