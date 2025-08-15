/**
 * @file IPC handlers for main process communication
 * 
 * Handles inter-process communication between renderer and main processes.
 * All handlers validate input data and perform secure operations on behalf
 * of the renderer process.
 * 
 * @remarks
 * Security: All handlers should validate input data and sanitize operations
 * to prevent security vulnerabilities from malicious renderer processes.
 */

import { ipcMain, nativeTheme } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { parseTheme, type Theme } from '@shared/theme';

/**
 * Handles theme source change notifications from the renderer process.
 * 
 * Updates Electron's native theme source to match user preferences,
 * which affects system-level UI elements like window chrome and
 * native dialogs.
 * 
 * @param source - The theme source to apply ('system', 'light', or 'dark')
 * 
 * @example
 * ```typescript
 * // From renderer process via preload:
 * window.xAPI.setNativeThemeSource('dark');
 * ```
 * 
 * @remarks
 * - Input is validated using the theme schema before application
 * - Invalid themes fall back to 'system' for safety
 * - Changes are applied immediately to the native theme system
 */
const handleThemeSourceChanged = (_event: Electron.IpcMainEvent, source: unknown): void => {
  // Validate and sanitize the theme source
  const validatedTheme: Theme = parseTheme(source);
  
  // Apply the theme to Electron's native theme system
  nativeTheme.themeSource = validatedTheme;
  
  console.log(`Theme source changed to: ${validatedTheme}`);
};

/**
 * Registers all IPC handlers with the main process.
 * 
 * Should be called during application initialization to set up
 * communication channels between renderer and main processes.
 * 
 * @example
 * ```typescript
 * // In main process initialization:
 * app.whenReady().then(() => {
 *   registerIpcHandlers();
 *   createWindow();
 * });
 * ```
 */
export const registerIpcHandlers = (): void => {
  // Theme management
  ipcMain.on(IPC_CHANNELS.R2M_NTF_THEME_SOURCE_CHANGED, handleThemeSourceChanged);
  
  console.log('IPC handlers registered successfully');
};

/**
 * Unregisters all IPC handlers from the main process.
 * 
 * Should be called during application shutdown to clean up
 * event listeners and prevent memory leaks.
 * 
 * @example
 * ```typescript
 * // During app shutdown:
 * app.on('before-quit', () => {
 *   unregisterIpcHandlers();
 * });
 * ```
 */
export const unregisterIpcHandlers = (): void => {
  // Remove all registered handlers
  ipcMain.removeAllListeners(IPC_CHANNELS.R2M_NTF_THEME_SOURCE_CHANGED);
  
  console.log('IPC handlers unregistered successfully');
};
