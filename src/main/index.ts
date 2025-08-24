import {
  app,
  BrowserWindow,
  nativeTheme,
  BaseWindow,
  WebContentsView,
  session,
  Menu,
  webContents,
} from 'electron'
import type { MenuItemConstructorOptions } from 'electron'
import { electronApp, is } from '@electron-toolkit/utils'
import {
  TRAFFIC_LIGHT_INSET_X_PX,
  TRAFFIC_LIGHT_SIZE_PX,
  getEffectiveTitlebarHeightPx,
  TITLEBAR_BG_HEX,
} from '@shared/constants/ui'
import { join } from 'node:path'

// Creates the single main application window with a macOS-native titlebar.
// Window size is fixed to a 16:9 aspect ratio for predictable layout.
function createMainWindow(): void {
  const preloadPath = join(__dirname, '../preload/index.cjs')

  // Fixed initial size and derived height to preserve 16:9 aspect
  const INITIAL_WIDTH = 1200 * 0.8
  const ASPECT_RATIO = 16 / 9
  const INITIAL_HEIGHT = Math.round(INITIAL_WIDTH / ASPECT_RATIO)
  // Effective overlay height shared across processes
  const OVERLAY_HEIGHT = getEffectiveTitlebarHeightPx()
  const TRAFFIC_LIGHT_SIZE = TRAFFIC_LIGHT_SIZE_PX

  const win = new BaseWindow({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    title: 'SparkPilot-X',
    minWidth: INITIAL_WIDTH,
    minHeight: INITIAL_HEIGHT,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: true,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    // Use hiddenInset to align with macOS Human Interface Guidelines
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    ...(process.platform === 'darwin'
      ? {
          // Titlebar overlay height is shared; changing it updates CSS via preload
          titleBarOverlay: {
            color: TITLEBAR_BG_HEX,
            symbolColor: '#000000',
            height: OVERLAY_HEIGHT,
          },
          // Precisely center traffic lights vertically: (overlayHeight - buttonSize)/2
          trafficLightPosition: {
            x: TRAFFIC_LIGHT_INSET_X_PX,
            y: Math.round((OVERLAY_HEIGHT - TRAFFIC_LIGHT_SIZE) / 2),
          },
          roundedCorners: true,
        }
      : {}),
  })

  // Create titlebar view
  const titlebarView = new WebContentsView({
    webPreferences: {
      preload: preloadPath,
      sandbox: true,
      contextIsolation: true,
      webSecurity: true,
    },
  })
  win.contentView.addChildView(titlebarView)
  titlebarView.setBounds({ x: 0, y: 0, width: INITIAL_WIDTH, height: OVERLAY_HEIGHT })

  // Create main content view
  const contentView = new WebContentsView({
    webPreferences: {
      preload: preloadPath,
      sandbox: true,
      contextIsolation: true,
      webSecurity: true,
    },
  })
  win.contentView.addChildView(contentView)
  contentView.setBounds({
    x: 0,
    y: OVERLAY_HEIGHT,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT - OVERLAY_HEIGHT,
  })

  // Load URLs for both views
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    const base = process.env.ELECTRON_RENDERER_URL
    const titlebarUrl = new URL('titlebar.html', base).toString()
    const contentUrl = new URL('index.html', base).toString()
    titlebarView.webContents.loadURL(titlebarUrl)
    contentView.webContents.loadURL(contentUrl)
  } else {
    titlebarView.webContents.loadFile(join(__dirname, '../renderer/titlebar.html'))
    contentView.webContents.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Keep views sized on window resize (though window is fixed, keep logic here)
  win.on('resized', () => {
    const [w, h] = win.getSize()
    titlebarView.setBounds({ x: 0, y: 0, width: w, height: OVERLAY_HEIGHT })
    contentView.setBounds({ x: 0, y: OVERLAY_HEIGHT, width: w, height: h - OVERLAY_HEIGHT })
  })
}

// Single-instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Focus existing window if user tries to open another instance
    const [win] = BrowserWindow.getAllWindows()
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    // Force light theme at the OS integration level where possible
    try {
      nativeTheme.themeSource = 'light'
    } catch {}

    // Configure platform integration helpers
    try {
      electronApp.setAppUserModelId('io.ai-copilotx.sparkpilot-x')
    } catch {}

    // Configure Content Security Policy headers (dev vs prod)
    try {
      const cspDev =
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws://localhost:*; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src 'self' blob:"
      const cspProd =
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"
      const csp = is.dev ? cspDev : cspProd

      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const responseHeaders = details.responseHeaders ?? {}
        // Normalize header key casing and set CSP
        responseHeaders['Content-Security-Policy'] = [csp]
        callback({ responseHeaders })
      })
    } catch {}

    createMainWindow()

    // Build application menu with a safe DevTools toggle that targets the focused WebContents
    try {
      const template: MenuItemConstructorOptions[] = []

      if (process.platform === 'darwin') {
        const appSubmenu: MenuItemConstructorOptions[] = [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ]
        template.push({ label: app.name, submenu: appSubmenu })
      }

      const editSubmenu: MenuItemConstructorOptions[] = [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ]
      template.push({ label: 'Edit', submenu: editSubmenu })

      const viewSubmenu: MenuItemConstructorOptions[] = []
      if (is.dev) {
        viewSubmenu.push({ role: 'reload' }, { role: 'forceReload' })
      }
      viewSubmenu.push({
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: () => {
          const focused = webContents.getFocusedWebContents()
          if (focused && !focused.isDestroyed()) focused.toggleDevTools()
        },
      })
      template.push({ label: 'View', submenu: viewSubmenu })

      const windowSubmenu: MenuItemConstructorOptions[] = [{ role: 'minimize' }, { role: 'zoom' }]
      if (process.platform === 'darwin') {
        windowSubmenu.push(
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        )
      } else {
        windowSubmenu.push({ role: 'close' })
      }
      template.push({ label: 'Window', submenu: windowSubmenu })

      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    } catch {}

    app.on('browser-window-created', (_event, window) => {
      // Custom devtools shortcut that works with WebContentsView
      try {
        window.webContents.on('before-input-event', (event, input) => {
          const isToggleCombo =
            input.key?.toLowerCase() === 'i' && (input.meta || input.control) && input.shift
          const isF12 = input.code === 'F12'
          if (is.dev && (isToggleCombo || isF12)) {
            const focused = webContents.getFocusedWebContents()
            if (focused && !focused.isDestroyed()) focused.toggleDevTools()
            event.preventDefault()
          }
        })
      } catch {}
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
