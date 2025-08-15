import { app, BrowserWindow } from "electron/main";
import { shell } from "electron/common";
import { join } from "path";
import { platform, is } from "@electron-toolkit/utils";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let mainWindow = null;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    // Window dimensions and constraints
    width: 1200,
    height: 800,
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
    show: false,
    // Prevents visual flash during initialization
    center: true,
    // Center window on screen
    alwaysOnTop: false,
    skipTaskbar: false,
    focusable: true,
    autoHideMenuBar: true,
    // Auto-hide menu bar for cleaner UI
    // Visual appearance
    titleBarStyle: platform.isMacOS ? "hiddenInset" : "default",
    // Enable overlay so renderer can draw a custom, VSCode-like title bar area under the traffic lights
    titleBarOverlay: platform.isMacOS ? {
      color: "#00000000",
      symbolColor: "#6B7280",
      // Tailwind gray-500 for traffic light symbols when applicable
      height: 40
    } : void 0,
    icon: join(__dirname, "../renderer/public/icon.png"),
    // TODO(assets): Verify icon path in production build
    backgroundColor: "#ffffff",
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
      sandbox: false,
      // Disabled to allow ES module preload script
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
      autoplayPolicy: "document-user-activation-required",
      // Security: Disable background throttling to prevent timing attacks
      backgroundThrottling: false,
      // Security: Disable JavaScript execution (if not needed)
      javascript: true,
      // Keep enabled for React app functionality
      // Security: Disable WebGL if not needed for your app
      webgl: false,
      // Disable unless you need 3D graphics
      // Security: Disable images if not needed
      images: true,
      // Keep enabled for UI elements
      // Security: Disable text area resizing
      textAreasAreResizable: false,
      // Preload script for secure IPC communication
      preload: join(__dirname, "../preload/index.mjs")
    }
  });
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event2, navigationUrl) => {
    event2.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  if (process.env.NODE_ENV === "production") {
    app.quit();
  }
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
