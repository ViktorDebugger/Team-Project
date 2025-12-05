'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks';

const BG_COLOR_KEY = 'bgColor';
const DEFAULT_COLOR = 'bg-blue-200';

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

const COLORS: ColorOption[] = [
  { name: 'Blue', value: 'bg-blue-200', hex: '#bfdbfe' },
  { name: 'Red', value: 'bg-red-200', hex: '#fecaca' },
  { name: 'Green', value: 'bg-green-200', hex: '#bbf7d0' },
  { name: 'Purple', value: 'bg-purple-200', hex: '#e9d5ff' },
  { name: 'Yellow', value: 'bg-yellow-200', hex: '#fef08a' },
  { name: 'Orange', value: 'bg-orange-200', hex: '#fed7aa' },
];

interface ThemeContextType {
  bgColor: string;
  colors: ColorOption[];
  setBgColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [bgColor, setBgColor] = useLocalStorage(BG_COLOR_KEY, DEFAULT_COLOR);

  return (
    <ThemeContext.Provider
      value={{
        bgColor,
        colors: COLORS,
        setBgColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
