import { app, BrowserWindow, screen } from 'electron/main';
import { shell, nativeImage } from 'electron/common';
import { join, resolve } from 'path';
import { is, platform } from '@electron-toolkit/utils';

import { registerIpcHandlers, unregisterIpcHandlers } from './ipc-handlers';
import { startTrpcServer, stopTrpcServer } from './trpc/server';

/**
 * Main process entry point for SparkPilot-X
 * 
 * Manages the core Electron application lifecycle, window creation, and security
 * configurations. This process runs with full Node.js access and handles all
 * system-level operations that the renderer process cannot perform directly.
 * 
 * @remarks
 * Security: Implements strict context isolation and prevents unauthorized
 * access to Node.js APIs from renderer processes.
 */

/** Main application window reference - prevents garbage collection */
let mainWindow: BrowserWindow | null = null;

/**
 * Enforce single-instance application behavior
 *
 * If another instance is launched, focus the existing window instead of creating a new one.
 */
const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
  // Ensure process exits on all platforms
  process.exit(0);
}

/**
 * Creates and configures the main application window with security-first settings
 * 
 * @remarks
 * Security: Uses contextIsolation and disables nodeIntegration to prevent
 * renderer process from accessing Node.js APIs directly.
 * 
 * Development: In dev mode, attempts to display window on second display if available
 */
const createWindow = (): void => {
  // Get available displays for positioning
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  
  // In development mode, try to use second display if available
  let targetDisplay = primaryDisplay;
  
  if (is.dev && displays.length > 1) {
    // Find the first non-primary display
    const secondaryDisplay = displays.find(display => display.id !== primaryDisplay.id);
    if (secondaryDisplay) {
      targetDisplay = secondaryDisplay;
      console.log(`Development mode: Targeting secondary display`);
    }
  }

  // Calculate optimal 16:9 dimensions for the target display
  // Leave some margin (80px total) to account for window decorations and ensure it fits
  const margin = 80;
  const maxWidth = targetDisplay.bounds.width - margin;
  const maxHeight = targetDisplay.bounds.height - margin;
  
  // Calculate the largest 16:9 dimensions that fit within the display bounds
  const aspectRatio = 16 / 9;
  let optimalWidth = maxWidth;
  let optimalHeight = optimalWidth / aspectRatio;
  
  // If height exceeds bounds, scale down proportionally
  if (optimalHeight > maxHeight) {
    optimalHeight = maxHeight;
    optimalWidth = optimalHeight * aspectRatio;
  }
  
  // Set window bounds
  const windowBounds = {
    width: Math.max(Math.round(optimalWidth), 800),
    height: Math.max(Math.round(optimalHeight), 600),
    x: targetDisplay.bounds.x + (targetDisplay.bounds.width - Math.max(Math.round(optimalWidth), 800)) / 2,
    y: targetDisplay.bounds.y + (targetDisplay.bounds.height - Math.max(Math.round(optimalHeight), 600)) / 2,
  };

  mainWindow = new BrowserWindow({
    // Window dimensions and constraints
    width: windowBounds.width,
    height: windowBounds.height,
    x: Math.round(windowBounds.x),
    y: Math.round(windowBounds.y),
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1920,
    maxHeight: 1080,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    
    // Window behavior
    show: false, // Prevents visual flash during initialization
    center: false, // Disable automatic centering, we are handling it manually
    alwaysOnTop: false,
    skipTaskbar: false,
    focusable: true,
    autoHideMenuBar: true, // Auto-hide menu bar for cleaner UI
    
    // Visual appearance
    titleBarStyle: platform.isMacOS ? 'hiddenInset' : 'default',
    // Enable overlay so renderer can draw a custom, VSCode-like title bar area under the traffic lights
    titleBarOverlay: platform.isMacOS
      ? {
          color: '#00000000',
          symbolColor: '#6B7280', // Tailwind gray-500 for traffic light symbols when applicable
          height: 36, // Optimized for macOS traffic light vertical centering
        }
      : undefined,
    icon: join(__dirname, '../renderer/public/logo/512x512.png'),
    backgroundColor: '#ffffff',
    transparent: false,
    frame: true,
    
    // Security and process configuration
    webPreferences: {
      // Security: Disable Node.js integration in renderer
      nodeIntegration: false,
      // Security: Disable Node.js integration in web workers
      nodeIntegrationInWorker: false,
      // Security: Disable Node.js integration in sub-frames
      nodeIntegrationInSubFrames: false,
      // Security: Enable context isolation for strong process separation
      contextIsolation: true,
      // Security: Prevent loading insecure content
      webSecurity: true,
      // Security: Prevent running insecure content from HTTP on HTTPS pages
      allowRunningInsecureContent: false,
      // Security: Enable process sandboxing for additional isolation
      sandbox: false, // Disabled to allow ES module preload script
      // Security: Disable experimental features that may have security implications
      experimentalFeatures: false,
      // Security: Disable webview creation from renderer
      webviewTag: false,
      // Security: Disable plugins that could be security risks
      plugins: false,
      // Security: Disable WebSQL API (deprecated and potentially insecure)
      enableWebSQL: false,
      // Security: Disable spellchecker that could leak data
      spellcheck: false,
      // Security: Disable navigation on drag and drop
      navigateOnDragDrop: false,
      // Security: Enable safe dialogs protection
      safeDialogs: true,
      // Security: Disable HTML fullscreen window resize
      disableHtmlFullscreenWindowResize: true,
      // Security: Disable autoplay without user gesture
      autoplayPolicy: 'document-user-activation-required',
      // Security: Disable background throttling to prevent timing attacks
      backgroundThrottling: false,
      // Security: Disable JavaScript execution (if not needed)
      javascript: true, // Keep enabled for React app functionality
      // Security: Disable WebGL if not needed for your app
      webgl: false, // Disable unless you need 3D graphics
      // Security: Disable images if not needed
      images: true, // Keep enabled for UI elements
      // Security: Disable text area resizing
      textAreasAreResizable: false,
      // Preload script for secure IPC communication
      preload: join(__dirname, '../preload/index.mjs'),
    },
  });

  // Environment-aware app loading
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    // Development: Hot-reload from electron-vite dev server
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from built static files
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Prevent visual flash by showing only when content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Security: External links open in default browser, not new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Clean up window reference on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Handle attempts to launch a second instance by focusing existing window
if (hasSingleInstanceLock) {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

/**
 * Application lifecycle event handlers
 * 
 * @remarks
 * tRPC Server: Started when app is ready and stopped gracefully before quit
 * macOS: Re-creates window when dock icon is clicked, following platform
 * conventions for single-window applications.
 */
app.whenReady().then(() => {
  // Set macOS dock icon explicitly for development and production
  if (platform.isMacOS) {
    const dockIconPath = app.isPackaged
      ? join(process.resourcesPath, 'logo/512x512.png')
      : resolve('src/renderer/public/logo/512x512.png');
    const dockIcon = nativeImage.createFromPath(dockIconPath);
    if (!dockIcon.isEmpty()) {
      app.dock?.setIcon(dockIcon);
    }
  }

  // Start tRPC server before creating the window
  // This enables type-safe API communication between main and renderer processes
  startTrpcServer();
  
  // Register IPC handlers before creating the window
  registerIpcHandlers();
  
  createWindow();

  // macOS: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Platform-specific quit behavior: quit on non-macOS when all windows close
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up IPC handlers and stop tRPC server before quitting
app.on('before-quit', async () => {
  unregisterIpcHandlers();
  await stopTrpcServer();
});

// Security: Prevent unauthorized navigation and redirect to external browser
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Crash handling: Log errors and quit gracefully in production
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // TODO(crash-reporting): Implement file logging or crash reporting service
  if (process.env.NODE_ENV === 'production') {
    app.quit();
  }
});

// Promise rejection handling: Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // TODO(crash-reporting): Implement file logging or crash reporting service
});
