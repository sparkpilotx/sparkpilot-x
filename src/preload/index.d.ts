import type { RuntimeVersions } from '@shared/types'

export type XApi = {
  system: {
    versions: () => RuntimeVersions
  }
}

declare global {
  interface Window {
    xAPI: XApi
  }
}

export {}
