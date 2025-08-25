import { contextBridge, ipcRenderer } from 'electron'

// Minimal surface for titlebar-only renderer
const title = {
  onChanged(handler: (title: string) => void): () => void {
    const listener = (_event: unknown, value: string) => handler(value)
    ipcRenderer.on('title:changed', listener)
    return () => ipcRenderer.off('title:changed', listener)
  },
  async get(): Promise<string> {
    return ipcRenderer.invoke('title:get')
  },
} as const

export const xAPI = { title } as const

contextBridge.exposeInMainWorld('xAPI', xAPI)


