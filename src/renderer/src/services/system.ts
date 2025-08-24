import type { RuntimeVersions } from '@shared/types/runtime'
export const systemService = {
  ping(_signal?: AbortSignal): string {
    return window.xAPI.system.ping()
  },
  versions(): RuntimeVersions {
    return window.xAPI.system.versions()
  },
}
