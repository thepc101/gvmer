import { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } from "electron";
import path from "path";
import { registerIpcHandlers } from "./ipc/handlers";
import { createTray, destroyTray } from "./tray";
import { createAppMenu } from "./menu";
import { initLogger, getLogger } from "./services/logger";
import { initCrashReporter } from "./services/crash-reporter";
import { initAutoUpdater } from "./services/updater";
import { closeDatabase } from "./services/database";
import { scanForGames } from "./services/game-detector";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const isDev = process.env.NODE_ENV !== "production";

function createWindow() {
  const log = getLogger();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    backgroundColor: "#FAFAFA",
    titleBarStyle: "hidden",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    log.info("[app] Window ready and shown");
  });

  // Minimize to tray instead of closing
  mainWindow.on("close", (e) => {
    if (mainWindow && !(app as any).isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      log.info("[app] Minimized to tray");
    }
  });

  // Register IPC handlers
  registerIpcHandlers(mainWindow);

  return mainWindow;
}

// --- Global keyboard shortcuts ---
function registerGlobalShortcuts() {
  const log = getLogger();

  globalShortcut.register("CommandOrControl+K", () => {
    mainWindow?.webContents.send("shortcut:search");
  });

  globalShortcut.register("CommandOrControl+,", () => {
    mainWindow?.webContents.send("shortcut:settings");
  });

  globalShortcut.register("CommandOrControl+W", () => {
    mainWindow?.hide();
  });

  log.info("[app] Global shortcuts registered");
}

// --- App lifecycle ---
app.whenReady().then(() => {
  // Initialize services
  initLogger();
  initCrashReporter();
  const log = getLogger();

  log.info("[app] Starting gvmer...");

  createWindow();
  createAppMenu(mainWindow!);
  registerGlobalShortcuts();

  // System tray
  tray = createTray(mainWindow!);

  // Auto-updater
  if (!isDev) {
    initAutoUpdater(mainWindow!);
  }

  // Initial game scan in background
  setTimeout(async () => {
    try {
      const games = scanForGames();
      log.info(`[app] Initial scan found ${games.length} games`);
      mainWindow?.webContents.send("games:scanned", games.length);
    } catch (err) {
      log.error("[app] Initial game scan failed:", err);
    }
  }, 3000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  (app as any).isQuitting = true;
  globalShortcut.unregisterAll();
  closeDatabase();
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

(app as any).isQuitting = false;
