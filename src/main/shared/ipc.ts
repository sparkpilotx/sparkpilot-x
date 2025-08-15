// IPC Channel definitions
// Naming convention: [Direction]_[Type]_[Description]
// Direction: R2M (Renderer to Main), M2R (Main to Renderer)
// Type: NTF (Notification), REQ (Request)
export const IPC_CHANNELS = {
  R2M_NTF_THEME_SOURCE_CHANGED: 'R2M_NTF_THEME_SOURCE_CHANGED',
} as const;