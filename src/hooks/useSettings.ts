import { useState, useEffect } from 'react';

export type ThemeId = 
  | 'apple' 
  | 'glass' 
  | 'vscode' 
  | 'windows' 
  | 'cyberpunk' 
  | 'ai' 
  | 'retro';

export function useSettings() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('apple');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [decimalPrecision, setDecimalPrecision] = useState<number>(10);

  // Load from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('calc_theme') as ThemeId;
    if (savedTheme) setActiveTheme(savedTheme);

    const savedDark = localStorage.getItem('calc_darkmode');
    if (savedDark !== null) setIsDarkMode(savedDark === 'true');

    const savedSound = localStorage.getItem('calc_sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    
    const savedPrec = localStorage.getItem('calc_precision');
    if (savedPrec) setDecimalPrecision(parseInt(savedPrec));
  }, []);

  const changeTheme = (theme: ThemeId) => {
    setActiveTheme(theme);
    localStorage.setItem('calc_theme', theme);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('calc_darkmode', next.toString());
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('calc_sound', next.toString());
      return next;
    });
  };

  const changePrecision = (prec: number) => {
    setDecimalPrecision(prec);
    localStorage.setItem('calc_precision', prec.toString());
  };

  // Sync dark mode class to HTML element for global styles (like scrollbars or some themes)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return {
    activeTheme,
    changeTheme,
    isDarkMode,
    toggleDarkMode,
    soundEnabled,
    toggleSound,
    decimalPrecision,
    changePrecision
  };
}
