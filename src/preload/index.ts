import { contextBridge } from 'electron'
import {
  getEffectiveTitlebarHeightPx,
  TITLEBAR_BG_HEX,
  TITLEBAR_BORDER_RGBA,
  TITLEBAR_FG_HEX,
  ACCENT_HEX,
  XS_FONT_SIZE_PX,
  XS_HEIGHT,
  XS_PADDING_X,
  XS_PADDING_Y,
  XS_RADIUS,
  XS_ROOT_FONT_SIZE_PX,
} from '@shared/constants/ui'
import type { RuntimeVersions } from '@shared/types/runtime'

// Preload composes a minimal, serializable API exposed to the renderer.
// Keep this surface narrow; do not expose Node primitives directly.
const system = {
  ping(): string {
    return 'pong'
  },
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

// Reflect shared titlebar height into renderer CSS variable at startup.
// Use documentElement style to avoid relying on <head> readiness.
const applyTitlebarCssVar = (): void => {
  const h = `${getEffectiveTitlebarHeightPx()}px`
  if (document?.documentElement?.style) {
    document.documentElement.style.setProperty('--titlebar-height', h)
    document.documentElement.style.setProperty('--titlebar-bg', TITLEBAR_BG_HEX)
    document.documentElement.style.setProperty('--titlebar-fg', TITLEBAR_FG_HEX)
    document.documentElement.style.setProperty('--titlebar-border', TITLEBAR_BORDER_RGBA)
    document.documentElement.style.setProperty('--accent', ACCENT_HEX)
    // XS sizing
    document.documentElement.style.setProperty('--xs-height', `${XS_HEIGHT}px`)
    document.documentElement.style.setProperty('--xs-radius', `${XS_RADIUS}px`)
    document.documentElement.style.setProperty('--xs-px', `${XS_PADDING_X}px`)
    document.documentElement.style.setProperty('--xs-py', `${XS_PADDING_Y}px`)
    document.documentElement.style.setProperty('--xs-font-size', `${XS_FONT_SIZE_PX}px`)
    document.documentElement.style.setProperty('--root-font-size', `${XS_ROOT_FONT_SIZE_PX}px`)
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', applyTitlebarCssVar, { once: true })
} else {
  applyTitlebarCssVar()
}
