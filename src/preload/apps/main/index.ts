import { contextBridge, ipcRenderer } from 'electron'
import type { RuntimeVersions, ThemeSource } from '@shared/types'
import { getThemeSource } from '@pshared/theme'

const system = {
  versions(): RuntimeVersions {
    return {
      node: process.versions.node,
      electron: process.versions.electron,
    }
  },
} as const

const title = {
  set(newTitle: string): void {
    ipcRenderer.send('title:set', newTitle)
  },
  async get(): Promise<string> {
    return ipcRenderer.invoke('title:get') as Promise<string>
  },
} as const

export const xAPI = {
  system,
  title,
  theme: {
    getSource(): ThemeSource {
      return getThemeSource()
    },
  },
} as const

contextBridge.exposeInMainWorld('xAPI', xAPI)
