// UI sizing constants used across processes (main, preload, renderer).
// Changing values here will propagate everywhere (titlebar overlay height
// and renderer CSS variable injection). Traffic lights are OS-controlled;
// let Electron center them vertically based on overlay height.
export const TITLEBAR_HEIGHT_PX = 32
// Approximate macOS traffic light button diameter used for vertical centering
export const TRAFFIC_LIGHT_SIZE_PX = 20
export const TRAFFIC_LIGHT_INSET_X_PX = 12
// Minimum comfortable macOS titlebar overlay height. Below this, OS buttons
// visually crowd; keep effective height >= this value when computing overlay.
export const MIN_MACOS_TITLEBAR_HEIGHT_PX = 28

export function getEffectiveTitlebarHeightPx(): number {
  return Math.max(TITLEBAR_HEIGHT_PX, MIN_MACOS_TITLEBAR_HEIGHT_PX)
}

// Titlebar theme colors (light theme only for now)
export const TITLEBAR_BG_HEX = '#ffffff'
export const TITLEBAR_FG_HEX = '#000000'
export const TITLEBAR_BORDER_RGBA = 'rgba(0, 0, 0, 0.08)'
export const ACCENT_HEX = '#0a84ff' // macOS system blue

// XS sizing tokens (single scale)
export const XS_HEIGHT = 24
export const XS_RADIUS = 4
export const XS_PADDING_X = 6
export const XS_PADDING_Y = 4
export const XS_FONT_SIZE_PX = 11
export const XS_ROOT_FONT_SIZE_PX = 11
