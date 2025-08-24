import { contextBridge } from 'electron'
import type { RuntimeVersions } from '@shared/types'

// Preload composes a minimal, serializable API exposed to the renderer.
// Keep this surface narrow; do not expose Node primitives directly.
const system = {
  versions(): RuntimeVersions {
    return {
      node: process.versions.node,
      electron: process.versions.electron,
    }
  },
} as const

// Expose a single xAPI object under window.xAPI
export const xAPI = {
  system,
} as const

contextBridge.exposeInMainWorld('xAPI', xAPI)
