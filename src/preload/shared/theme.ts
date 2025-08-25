import { nativeTheme } from 'electron'
import type { ThemeSource } from '@shared/types'

export function getThemeSource(): ThemeSource {
  // nativeTheme.themeSource returns 'system' | 'light' | 'dark'
  return nativeTheme.themeSource as ThemeSource
}


