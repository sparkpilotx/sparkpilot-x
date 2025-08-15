/**
 * @file Theme management hook
 * 
 * Provides a convenient interface for accessing and managing theme state
 * following the renderer rules for hook organization and atomic selectors.
 * 
 * @remarks
 * Uses useShallow for optimal performance when selecting multiple values
 * from the theme store, preventing unnecessary re-renders.
 */

import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

import { useThemeStore, themeSelectors } from '@/stores/theme-store';
import type { Theme } from '@shared/theme';

/**
 * Hook return type for theme management
 */
interface UseThemeReturn {
  /** Current theme preference */
  theme: Theme;
  /** Resolved theme (what's actually applied) */
  resolvedTheme: 'light' | 'dark';
  /** Whether the system prefers dark mode */
  systemPrefersDark: boolean;
  /** Function to change the theme */
  setTheme: (theme: Theme) => void;
  /** Whether the current resolved theme is dark */
  isDark: boolean;
  /** Whether the current resolved theme is light */
  isLight: boolean;
}

/**
 * Theme management hook with automatic initialization
 * 
 * Provides access to theme state and actions while ensuring the theme store
 * is properly initialized with system theme detection and event listeners.
 * 
 * @example
 * ```typescript
 * const { theme, resolvedTheme, setTheme, isDark } = useTheme();
 * 
 * // Change theme
 * const handleToggle = () => {
 *   const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
 *   setTheme(nextTheme);
 * };
 * 
 * // Use resolved theme for conditional rendering
 * return (
 *   <div className={isDark ? 'dark-specific-class' : 'light-specific-class'}>
 *     Current theme: {theme} (resolved: {resolvedTheme})
 *   </div>
 * );
 * ```
 * 
 * @returns Theme state and actions with derived boolean flags
 */
export const useTheme = (): UseThemeReturn => {
  // Use atomic selectors with useShallow for optimal performance
  const { theme, resolvedTheme, systemPrefersDark } = useThemeStore(
    useShallow(themeSelectors.themeState)
  );
  
  const setTheme = useThemeStore(themeSelectors.setTheme);
  const initialize = useThemeStore(state => state.initialize);

  // Initialize theme store on first use
  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  // Derived boolean flags for convenience
  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  return {
    theme,
    resolvedTheme,
    systemPrefersDark,
    setTheme,
    isDark,
    isLight,
  };
};

/**
 * Lightweight hook for just the theme preference
 * 
 * Use this when you only need the current theme preference without
 * the full theme state, reducing unnecessary subscriptions.
 * 
 * @example
 * ```typescript
 * const theme = useThemePreference();
 * ```
 */
export const useThemePreference = (): Theme => {
  return useThemeStore(themeSelectors.theme);
};

/**
 * Lightweight hook for just the resolved theme
 * 
 * Use this when you only need to know if the current applied theme
 * is light or dark, without the full theme state.
 * 
 * @example
 * ```typescript
 * const resolvedTheme = useResolvedTheme();
 * const isDark = resolvedTheme === 'dark';
 * ```
 */
export const useResolvedTheme = (): 'light' | 'dark' => {
  return useThemeStore(themeSelectors.resolvedTheme);
};

/**
 * Hook for theme actions only
 * 
 * Use this in components that only need to change the theme
 * without subscribing to theme state changes.
 * 
 * @example
 * ```typescript
 * const setTheme = useThemeActions();
 * 
 * const handleDarkMode = () => setTheme('dark');
 * ```
 */
export const useThemeActions = () => {
  return useThemeStore(themeSelectors.setTheme);
};
