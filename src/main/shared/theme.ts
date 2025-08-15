import { z } from 'zod';

/**
 * Theme preference options for the application
 * - system: Follows the operating system's theme preference
 * - light: Always uses light theme
 * - dark: Always uses dark theme
 */
export const ThemeSchema = z.enum(['system', 'light', 'dark']);

/**
 * Type representing the three possible theme states
 */
export type Theme = z.infer<typeof ThemeSchema>;

/**
 * Default theme preference
 */
export const DEFAULT_THEME: Theme = 'system';

/**
 * Array of all available theme options for cycling through
 */
export const THEME_OPTIONS: readonly Theme[] = ['system', 'light', 'dark'] as const;

/**
 * Validates if a string is a valid theme value
 */
export const isValidTheme = (value: unknown): value is Theme => {
  return ThemeSchema.safeParse(value).success;
};

/**
 * Safely parses a theme value, returning the default if invalid
 */
export const parseTheme = (value: unknown): Theme => {
  const result = ThemeSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_THEME;
};
