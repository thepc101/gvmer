import { ipcMain, BrowserWindow, dialog, shell, app } from "electron";
import path from "path";
import { IPC_CHANNELS } from "../../shared/types";
import { getLogger } from "../services/logger";
import { checkForUpdates, downloadUpdate, installUpdate } from "../services/updater";

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  const log = getLogger();

  // ── Window controls ──────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => mainWindow.minimize());
  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => mainWindow.close());
  ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, () => mainWindow.isMaximized());
  mainWindow.on("maximize", () => mainWindow.webContents.send(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, true));
  mainWindow.on("unmaximize", () => mainWindow.webContents.send(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, false));

  // ── App info ─────────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_APP_INFO, () => ({
    name: app.getName(),
    version: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    userData: app.getPath("userData"),
    logs: app.getPath("userData") + "/logs",
  }));

  // ── Game detection ───────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.SCAN_GAMES, async () => {
    log.info("[games] Scanning for installed games...");
    try {
      const { scanForGames } = await import("../services/game-detector");
      const games = scanForGames();
      log.info(`[games] Found ${games.length} games`);
      return games;
    } catch (err) {
      log.error("[games] Scan failed:", err);
      return [];
    }
  });

  // ── Launch game ──────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.LAUNCH_GAME, async (_event, installPath: string, launcherId?: string) => {
    try {
      if (launcherId) await shell.openPath(launcherId);
      else await shell.openPath(installPath);
      log.info(`[games] Launched: ${installPath}`);
      return { success: true };
    } catch (err) {
      log.error(`[games] Launch failed: ${installPath}`, err);
      return { success: false, error: String(err) };
    }
  });

  // ── File dialogs ─────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle(IPC_CHANNELS.SELECT_FILE, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select File",
      filters: [{ name: "All Files", extensions: ["*"] }],
      properties: ["openFile"],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // ── Platform info ────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_PLATFORM, () => process.platform);

  // ── Updates ──────────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES, () => checkForUpdates());
  ipcMain.handle(IPC_CHANNELS.DOWNLOAD_UPDATE, () => downloadUpdate());
  ipcMain.handle(IPC_CHANNELS.INSTALL_UPDATE, () => installUpdate());

  // ── External links ───────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.OPEN_EXTERNAL, async (_event, url: string) => {
    await shell.openExternal(url);
  });

  // ── Logging from renderer ────────────────────────────────
  ipcMain.on("renderer:log", (_event, level: string, ...args: any[]) => {
    const msg = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
    (log as any)[level]?.("[renderer]", msg);
  });
}
