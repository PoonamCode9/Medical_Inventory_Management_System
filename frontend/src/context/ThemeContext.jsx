import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'medistock-theme';

// Possible themes: 'dark' | 'light' | 'system'
const ThemeContext = createContext(null);

function resolveEffectiveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyTheme(effective) {
  const root = document.documentElement;
  if (effective === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  // Apply on mount and whenever theme changes
  useEffect(() => {
    const effective = resolveEffectiveTheme(theme);
    applyTheme(effective);

    // For 'system', listen to OS preference changes
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    setTheme(newTheme);
  };

  const effectiveTheme = resolveEffectiveTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
