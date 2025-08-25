import type { RuntimeVersions } from '@shared/types'

// Services layer is the only place that touches window.xAPI
export function getRuntimeVersions(): RuntimeVersions {
  const api = window.xAPI as unknown
  if (api && typeof api === 'object' && 'system' in (api as Record<string, unknown>)) {
    return (api as { system: { versions: () => RuntimeVersions } }).system.versions()
  }
  // Fallback for titlebar renderer which does not expose system
  return { electron: process.versions.electron ?? '', node: process.versions.node }
}
