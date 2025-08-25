import { app, BaseWindow, WebContentsView, Menu, webContents, ipcMain, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let mainWindowRef: BaseWindow | null = null
let titlebarWebContentsId: number | null = null
let currentTitle = 'SparkPilot-X'

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
  mainWindow.setTitle(currentTitle)
  mainWindowRef = mainWindow
  // Enforce 16:9 window aspect ratio
  mainWindow.setAspectRatio(16 / 9)
  // Minimum size at 16:9
  mainWindow.setMinimumSize(960, 540)

  // Views: titlebar (top) + main content (rest)
  const titlebarView = new WebContentsView({
    webPreferences: {
      preload: resolvePreloadFile('titlebar.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  // Titlebar hygiene: keep it inert and lightweight
  titlebarView.webContents.setIgnoreMenuShortcuts(true)
  titlebarView.webContents.setVisualZoomLevelLimits(1, 1)
  titlebarView.webContents.setAudioMuted(true)
  titlebarWebContentsId = titlebarView.webContents.id
  titlebarView.webContents.on('did-finish-load', () => {
    titlebarWebContentsId = titlebarView.webContents.id
    if (currentTitle) {
      titlebarWebContentsId &&
        webContents.fromId(titlebarWebContentsId)?.send('title:changed', currentTitle)
    }
  })
  const mainContentView = new WebContentsView({
    webPreferences: {
      // Preload runs with sandbox: true (see electron.vite.config.ts)
      preload: resolvePreloadFile('main.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Popup policy: deny window.open and open externally
  mainContentView.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Diagnostics: observe renderer health and load failures
  for (const wc of [titlebarView.webContents, mainContentView.webContents]) {
    wc.on('render-process-gone', (_e, details) => {
      if (is.dev) console.error('renderer gone', details)
    })
    wc.on('unresponsive', () => {
      if (is.dev) console.warn('renderer unresponsive')
    })
    wc.on('responsive', () => {
      if (is.dev) console.warn('renderer responsive again')
    })
    wc.on(
      'did-fail-load',
      (
        _e,
        errorCode,
        errorDescription,
        validatedURL,
        isMainFrame,
        frameProcessId,
        frameRoutingId,
      ) => {
        if (is.dev) {
          console.error('load failed', {
            errorCode,
            errorDescription,
            validatedURL,
            isMainFrame,
            frameProcessId,
            frameRoutingId,
          })
        }
      },
    )
    wc.on('preload-error', (_e, path, error) => {
      if (is.dev) console.error('preload error', path, error)
    })
  }

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

  // Resource management: explicitly close WebContents of child views
  // to avoid leaks when the BaseWindow is closed.
  // Ref: https://www.electronjs.org/docs/latest/api/base-window#resource-management
  mainWindow.on('closed', () => {
    if (!titlebarView.webContents.isDestroyed()) titlebarView.webContents.close()
    if (!mainContentView.webContents.isDestroyed()) mainContentView.webContents.close()

    titlebarWebContentsId = null
    mainWindowRef = null

    if (is.dev) console.warn('closed')
  })

  // Dev vs prod loading
  const devBase = process.env.ELECTRON_RENDERER_URL?.replace(/\/$/, '')

  // Externalize navigations: keep app confined to its own origin
  mainContentView.webContents.on('will-navigate', (event, url) => {
    const allowInDev = !!devBase && url.startsWith(devBase)
    const allowInProd = !devBase && url.startsWith('file:')
    if (allowInDev || allowInProd) return
    event.preventDefault()
    shell.openExternal(url)
  })

  if (devBase) {
    // Electron-Vite dev server
    await titlebarView.webContents.loadURL(`${devBase}/apps/titlebar/index.html`)
    await mainContentView.webContents.loadURL(`${devBase}/apps/main/index.html`)
  } else {
    // Packaged build
    await titlebarView.webContents.loadFile(resolveRendererFile('apps/titlebar/index.html'))
    await mainContentView.webContents.loadFile(resolveRendererFile('apps/main/index.html'))
  }

  // Initial layout after content is ready
  layout()

  // Ensure the main content view has focus so DevTools actions target it
  mainContentView.webContents.focus()

  console.log('is dev', is.dev)
}

app.whenReady().then(() => {
  // Set app user model ID for Windows notifications and shell integration
  electronApp.setAppUserModelId('io.ai-copilots.sparkpilot-x')

  // Watch common window shortcuts (F12 toggle in dev; ignore reload in prod)
  app.on('browser-window-created', (_event, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  void createMainWindow()

  // Title IPC: accept updates (fire-and-forget) and targeted broadcast to titlebar view
  ipcMain.removeAllListeners('title:set')
  ipcMain.on('title:set', (_event, newTitle: string) => {
    currentTitle = newTitle
    mainWindowRef?.setTitle(newTitle)
    if (titlebarWebContentsId) {
      webContents.fromId(titlebarWebContentsId)?.send('title:changed', newTitle)
    }
  })

  // Title IPC: get current title
  ipcMain.removeHandler('title:get')
  ipcMain.handle('title:get', async () => currentTitle)

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
