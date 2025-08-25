import { contextBridge, ipcRenderer } from 'electron'
import type { RuntimeVersions } from '@shared/types'

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
} as const

contextBridge.exposeInMainWorld('xAPI', xAPI)
