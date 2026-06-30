import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import { registerIpcHandlers } from "./ipc/handlers";
import { createTray, destroyTray } from "./tray";
import { createAppMenu } from "./menu";
import { initLogger, getLogger } from "./services/logger";
import { initCrashReporter } from "./services/crash-reporter";
import { initAutoUpdater } from "./services/updater";
import { scanForGames } from "./services/game-detector";

let mainWindow: BrowserWindow | null = null;
let tray: ReturnType<typeof createTray> | null = null;
const isDev = !app.isPackaged;

async function createWindow() {
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

  mainWindow.on("close", (e) => {
    if (mainWindow && !(app as any).isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      log.info("[app] Minimized to tray");
    }
  });

  registerIpcHandlers(mainWindow);
  tray = createTray(mainWindow);
  createAppMenu(mainWindow);

  if (!isDev) initAutoUpdater(mainWindow);

  setTimeout(async () => {
    try {
      const games = scanForGames();
      log.info(`[app] Initial scan found ${games.length} games`);
      mainWindow?.webContents.send("games:scanned", games.length);
    } catch (err) {
      log.error("[app] Initial game scan failed:", err);
    }
  }, 3000);
}

function registerGlobalShortcuts() {
  const log = getLogger();
  globalShortcut.register("CommandOrControl+K", () => mainWindow?.webContents.send("shortcut:search"));
  globalShortcut.register("CommandOrControl+,", () => mainWindow?.webContents.send("shortcut:settings"));
  globalShortcut.register("CommandOrControl+W", () => mainWindow?.hide());
  log.info("[app] Global shortcuts registered");
}

app.whenReady().then(async () => {
  initLogger();
  initCrashReporter();
  const log = getLogger();

  log.info("[app] Starting gvmer...");
  await createWindow();
  registerGlobalShortcuts();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  (app as any).isQuitting = true;
  globalShortcut.unregisterAll();
  destroyTray();
});

(app as any).isQuitting = false;
