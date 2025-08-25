import type { RuntimeVersions } from '@shared/types'

export type XApi =
  | {
      // Full xAPI for main renderer
      system: { versions: () => RuntimeVersions }
      title: {
        set: (title: string) => void
        get: () => Promise<string>
      }
    }
  | {
      // Minimal xAPI for titlebar renderer
      title: {
        onChanged: (handler: (title: string) => void) => () => void
        get: () => Promise<string>
      }
    }

declare global {
  interface Window {
    xAPI: XApi
  }
}

export {}
