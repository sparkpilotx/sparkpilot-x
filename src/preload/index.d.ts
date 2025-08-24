import type { RuntimeVersions } from '@shared/types/runtime'

export type XApi = {
  system: {
    ping: () => string
    versions: () => RuntimeVersions
  }
}

declare global {
  interface Window {
    xAPI: XApi
  }
}

export {}
