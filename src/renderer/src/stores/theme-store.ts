/**
 * @file Theme state management store using Zustand
 * 
 * Manages application theme state with persistence and system theme detection.
 * Follows the renderer rules for global state management using Zustand with
 * the recommended middleware stack.
 * 
 * @remarks
 * - Uses slice-based architecture for maintainability
 * - Implements atomic selectors with useShallow for performance
 * - Integrates with both renderer CSS and native theme system
 * - Handles system theme preference detection and changes
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DEFAULT_THEME, type Theme } from '@shared/theme';

/**
 * Theme store state interface
 */
interface ThemeState {
  /** Current theme preference */
  theme: Theme;
  /** Resolved theme (what's actually applied - handles 'system' resolution) */
  resolvedTheme: 'light' | 'dark';
  /** Whether the system prefers dark mode */
  systemPrefersDark: boolean;
}

/**
 * Theme store actions interface
 */
interface ThemeActions {
  /** Set the theme preference and update both renderer and native themes */
  setTheme: (theme: Theme) => void;
  /** Update system preference (called when system theme changes) */
  updateSystemPreference: (prefersDark: boolean) => void;
  /** Initialize theme detection and listeners */
  initialize: () => void;
}

/**
 * Combined theme store interface
 */
type ThemeStore = ThemeState & ThemeActions;

/**
 * Resolves the actual theme to apply based on preference and system settings
 */
const resolveTheme = (theme: Theme, systemPrefersDark: boolean): 'light' | 'dark' => {
  if (theme === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return theme;
};

/**
 * Applies the resolved theme to the document root element
 */
const applyThemeToDOM = (resolvedTheme: 'light' | 'dark'): void => {
  const root = document.documentElement;
  
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * Theme store with Zustand middleware stack
 * 
 * Uses the recommended middleware stack from renderer rules:
 * - devtools: Redux DevTools integration for debugging
 * - persist: Saves theme preference to main process storage
 * - subscribeWithSelector: Enables selective subscriptions
 * - immer: Immutable state updates with mutable syntax
 * 
 * @example
 * ```typescript
 * // Get current theme
 * const theme = useThemeStore(state => state.theme);
 * 
 * // Set theme with atomic selector
 * const setTheme = useThemeStore(state => state.setTheme);
 * 
 * // Multiple values with useShallow
 * const { theme, resolvedTheme } = useThemeStore(
 *   useShallow(state => ({ theme: state.theme, resolvedTheme: state.resolvedTheme }))
 * );
 * ```
 */
export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          theme: DEFAULT_THEME,
          resolvedTheme: 'light',
          systemPrefersDark: false,

          // Actions
          setTheme: (theme: Theme) => {
            set((state) => {
              state.theme = theme;
              state.resolvedTheme = resolveTheme(theme, state.systemPrefersDark);
            });

            // Apply theme to DOM
            const { resolvedTheme } = get();
            applyThemeToDOM(resolvedTheme);

            // Notify main process for native theme updates
            window.xAPI.setNativeThemeSource(theme);

            console.log(`Theme changed to: ${theme} (resolved: ${resolvedTheme})`);
          },

          updateSystemPreference: (prefersDark: boolean) => {
            set((state) => {
              state.systemPrefersDark = prefersDark;
              // Re-resolve theme in case current theme is 'system'
              state.resolvedTheme = resolveTheme(state.theme, prefersDark);
            });

            // Apply updated resolved theme to DOM
            const { resolvedTheme, theme } = get();
            applyThemeToDOM(resolvedTheme);

            // If current theme is 'system', notify main process of the change
            if (theme === 'system') {
              window.xAPI.setNativeThemeSource('system');
            }

            console.log(`System theme preference updated: ${prefersDark ? 'dark' : 'light'}`);
          },

          initialize: () => {
            // Detect initial system preference
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const initialPrefersDark = mediaQuery.matches;

            set((state) => {
              state.systemPrefersDark = initialPrefersDark;
              state.resolvedTheme = resolveTheme(state.theme, initialPrefersDark);
            });

            // Apply initial theme to DOM
            const { resolvedTheme, theme } = get();
            applyThemeToDOM(resolvedTheme);

            // Sync main process with stored theme preference at startup
            // This ensures native theme matches the persisted user preference
            window.xAPI.setNativeThemeSource(theme);

            // Listen for system theme changes
            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
              get().updateSystemPreference(e.matches);
            };

            mediaQuery.addEventListener('change', handleSystemThemeChange);

            console.log(`Theme store initialized: ${theme} (resolved: ${resolvedTheme})`);
            console.log(`Native theme synced with stored preference: ${theme}`);

            // Return cleanup function
            return () => {
              mediaQuery.removeEventListener('change', handleSystemThemeChange);
            };
          },
        }))
      ),
      {
        name: 'sparkpilot-theme-store',
        // Only persist the theme preference, not derived state
        partialize: (state) => ({ theme: state.theme }),
        // Use localStorage for theme preference persistence
        storage: {
          getItem: async (name: string) => {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          },
          setItem: async (name: string, value: any) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: async (name: string) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    {
      name: 'theme-store',
    }
  )
);

/**
 * Atomic selectors for common theme store access patterns
 * Use these with useShallow for optimal performance
 */
export const themeSelectors = {
  /** Get current theme preference */
  theme: (state: ThemeStore) => state.theme,
  /** Get resolved theme (actual applied theme) */
  resolvedTheme: (state: ThemeStore) => state.resolvedTheme,
  /** Get system preference */
  systemPrefersDark: (state: ThemeStore) => state.systemPrefersDark,
  /** Get theme setter action */
  setTheme: (state: ThemeStore) => state.setTheme,
  /** Get theme and resolved theme together */
  themeState: (state: ThemeStore) => ({ 
    theme: state.theme, 
    resolvedTheme: state.resolvedTheme 
  }),
} as const;
