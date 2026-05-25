import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Color Palettes ──────────────────────────────────────────────
export const LightColors = {
  primary: '#1A365D',
  secondary: '#D69E2E',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  switchTrackOff: '#767577',
  switchThumbOff: '#f4f3f4',
  highlightBg: '#F3F4F6',
  tabBarBg: '#FFFFFF',
};

export const DarkColors = {
  primary: '#63B3ED',
  secondary: '#ECC94B',
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textDisabled: '#475569',
  border: '#334155',
  divider: '#334155',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  overlay: 'rgba(0, 0, 0, 0.7)',
  white: '#FFFFFF',
  switchTrackOff: '#475569',
  switchThumbOff: '#94A3B8',
  highlightBg: '#334155',
  tabBarBg: '#1E293B',
};

export type AppColors = typeof LightColors;

// ─── Context Type ────────────────────────────────────────────────
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: AppColors;
}

const THEME_STORAGE_KEY = '@suk_dark_mode';

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: LightColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load persisted theme preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) {
          setIsDarkMode(stored === 'true');
        }
      } catch (err) {
        console.error('[ThemeContext] Failed to load theme preference:', err);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, String(next)).catch((err) =>
        console.error('[ThemeContext] Failed to save theme preference:', err)
      );
      return next;
    });
  }, []);

  const colors = isDarkMode ? DarkColors : LightColors;

  // Don't render children until we've loaded the persisted preference
  // to avoid a flash of the wrong theme
  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
