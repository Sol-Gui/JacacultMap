import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, saveData } from '../services/localStorage';
import { baseLight, baseDark } from '../styles/app/mainPage';

type Theme = typeof baseLight;

interface ThemeContextType {
  isDarkMode: boolean;
  accentColor: string;
  theme: Theme;
  toggleDarkMode: () => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const DEFAULT_ACCENT = '#10B981';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [isLoading, setIsLoading] = useState(true);

  const theme: Theme = isDarkMode
    ? { ...baseDark, primary: accentColor }
    : { ...baseLight, primary: accentColor };

  const loadTheme = async () => {
    try {
      setIsLoading(true);
      const [storedDarkMode, storedAccentColor] = await Promise.all([
        getData('isDarkMode'),
        getData('accentColor'),
      ]);
      if (storedDarkMode !== null) {
        setIsDarkMode(storedDarkMode === 'true');
      }
      if (storedAccentColor !== null) {
        setAccentColorState(storedAccentColor);
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

  const setAccentColor = async (color: string) => {
    try {
      setAccentColorState(color);
      await saveData('accentColor', color);
    } catch (err) {
      console.error('Erro ao salvar cor de destaque:', err);
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