import type { RuntimeVersions } from '@shared/types'

// Services layer is the only place that touches window.xAPI
export function getRuntimeVersions(): RuntimeVersions {
  return window.xAPI.system.versions()
}
