import { app, BaseWindow, WebContentsView, Menu, webContents } from 'electron'
import { fileURLToPath } from 'node:url'

function resolveRendererFile(relativePath: string): string {
  // Resolve a file in the built renderer relative to the compiled main file
  const url = new URL(`../renderer/${relativePath}`, import.meta.url)
  return fileURLToPath(url)
}

function resolvePreloadFile(relativePath: string): string {
  // Resolve a file in the built preload bundle relative to the compiled main file
  const url = new URL(`../preload/${relativePath}`, import.meta.url)
  return fileURLToPath(url)
}

async function createMainWindow(): Promise<void> {
  const mainWindow = new BaseWindow({
    width: 1280,
    height: 720,
    // Hide native frame so we can use a custom titlebar view
    frame: false,
    fullscreenable: false,
    // Keep defaults secure; views will set their own webPreferences
  })
  // Enforce 16:9 window aspect ratio
  mainWindow.setAspectRatio(16 / 9)
  // Minimum size at 16:9
  mainWindow.setMinimumSize(960, 540)

  // Views: titlebar (top) + main content (rest)
  const titlebarView = new WebContentsView()
  const mainContentView = new WebContentsView({
    webPreferences: {
      // Preload runs with sandbox: true (see electron.vite.config.ts)
      preload: resolvePreloadFile('index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Attach views to window contentView
  mainWindow.contentView.addChildView(titlebarView)
  mainWindow.contentView.addChildView(mainContentView)

  const TITLEBAR_HEIGHT = 32
  const layout = (): void => {
    const { width, height } = mainWindow.getContentBounds()
    titlebarView.setBounds({ x: 0, y: 0, width, height: TITLEBAR_HEIGHT })
    mainContentView.setBounds({
      x: 0,
      y: TITLEBAR_HEIGHT,
      width,
      height: Math.max(0, height - TITLEBAR_HEIGHT),
    })
  }

  mainWindow.on('resize', layout)

  // Dev vs prod loading
  const devBase = process.env.ELECTRON_RENDERER_URL?.replace(/\/$/, '')

  if (devBase) {
    // Electron-Vite dev server
    await titlebarView.webContents.loadURL(`${devBase}/titlebar.html`)
    await mainContentView.webContents.loadURL(`${devBase}/index.html`)
  } else {
    // Packaged build
    await titlebarView.webContents.loadFile(resolveRendererFile('titlebar.html'))
    await mainContentView.webContents.loadFile(resolveRendererFile('index.html'))
  }

  // Initial layout after content is ready
  layout()

  // Ensure the main content view has focus so DevTools actions target it
  mainContentView.webContents.focus()
}

app.whenReady().then(() => {
  void createMainWindow()

  // Replace default menu to support DevTools with Views-based windows
  const isMac = process.platform === 'darwin'
  const menu = Menu.buildFromTemplate([
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            webContents.getFocusedWebContents()?.reload()
          },
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+CmdOrCtrl+R',
          click: () => {
            webContents.getFocusedWebContents()?.reloadIgnoringCache()
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle DevTools (Detached)',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            const wc = webContents.getFocusedWebContents()
            if (!wc) return
            if (wc.isDevToolsOpened()) wc.closeDevTools()
            else wc.openDevTools({ mode: 'detach' })
          },
        },
      ],
    },
    { role: 'windowMenu' },
  ])
  Menu.setApplicationMenu(menu)

  app.on('activate', () => {
    if (BaseWindow.getAllWindows().length === 0) {
      void createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
