import type { ThemeSource } from '@shared/types'
import { getThemeSource } from '@pshared/theme'
import { contextBridge, ipcRenderer } from 'electron'

// Minimal surface for titlebar-only renderer
const title = {
  onChanged(handler: (title: string) => void): () => void {
    const listener = (_event: unknown, value: string): void => handler(value)
    ipcRenderer.on('title:changed', listener)
    return () => ipcRenderer.off('title:changed', listener)
  },
  async get(): Promise<string> {
    return ipcRenderer.invoke('title:get') as Promise<string>
  },
} as const

const theme = {
  getSource(): ThemeSource {
    return getThemeSource()
  },
} as const

export const xAPI = { title, theme } as const

contextBridge.exposeInMainWorld('xAPI', xAPI)
