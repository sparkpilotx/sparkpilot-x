import type { RuntimeVersions } from '@shared/types'

export type XApi = {
  system: {
    versions: () => RuntimeVersions
  }
  title: {
    set: (title: string) => void
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
