import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Strict light theme enforcement as mandated by hospital UI requirements
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('carelens_theme', 'light');
  }, [theme]);

  const toggleTheme = () => {
    // Keep light theme active
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

