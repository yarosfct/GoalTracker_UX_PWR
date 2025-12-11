import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

/**
 * Custom hook to manage theme application and switching
 * Applies theme settings to the document root via data attributes
 */
export function useTheme() {
  const { settings } = useApp();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme data attributes
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-color-scheme', settings.colorScheme);
    
    // Optional: Add transition class for smooth theme switching
    root.classList.add('theme-transition');
    
  }, [settings.theme, settings.colorScheme]);

  return {
    theme: settings.theme,
    colorScheme: settings.colorScheme,
    isMinimal: settings.theme === 'minimal',
    isColorful: settings.theme === 'colorful',
    isLight: settings.colorScheme === 'light',
    isDark: settings.colorScheme === 'dark',
  };
}

