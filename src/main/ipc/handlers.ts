import { ipcMain, BrowserWindow, dialog, shell, app } from "electron";
import { IPC_CHANNELS } from "../../shared/types";
import { scanForGames, getStoredGames } from "../services/game-detector";
import { getDatabase } from "../services/database";
import { getLogger } from "../services/logger";
import { checkForUpdates, downloadUpdate, installUpdate } from "../services/updater";

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  const log = getLogger();

  // --- Window controls ---
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => mainWindow.minimize());
  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => mainWindow.close());
  ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, () => mainWindow.isMaximized());

  mainWindow.on("maximize", () => mainWindow.webContents.send(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, true));
  mainWindow.on("unmaximize", () => mainWindow.webContents.send(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, false));

  // --- App info ---
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

  // --- Game detection ---
  ipcMain.handle(IPC_CHANNELS.SCAN_GAMES, async () => {
    log.info("[games] Scanning for installed games...");
    try {
      const games = scanForGames();
      log.info(`[games] Found ${games.length} games`);
      return games;
    } catch (err) {
      log.error("[games] Scan failed:", err);
      return [];
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_GAMES, async () => {
    return getStoredGames();
  });

  ipcMain.handle(IPC_CHANNELS.GET_GAME, async (_event, id: string) => {
    const db = getDatabase();
    return db.prepare("SELECT * FROM games WHERE id = ?").get(id);
  });

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

  // --- Settings ---
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
    const db = getDatabase();
    const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
    const defaults: Record<string, any> = {
      theme: "light",
      language: "en",
      launchOnStartup: false,
      minimizeToTray: true,
      notificationsEnabled: true,
      connectedAccounts: ["Steam", "Discord"],
      autoUpdateEnabled: true,
    };
    for (const row of rows) {
      try { defaults[row.key] = JSON.parse(row.value); } catch { defaults[row.key] = row.value; }
    }
    return defaults;
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_SETTINGS, async (_event, key: string, value: any) => {
    const db = getDatabase();
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, JSON.stringify(value));
    log.info(`[settings] Updated: ${key} = ${JSON.stringify(value)}`);
    return { success: true };
  });

  // --- User data ---
  ipcMain.handle(IPC_CHANNELS.GET_USER, async () => {
    const db = getDatabase();
    const user = db.prepare("SELECT * FROM user_profile WHERE id = 'default'").get() as any;
    return user ? {
      id: user.id, username: user.username, avatar: user.avatar,
      xp: user.xp, level: user.level, status: user.status,
    } : null;
  });

  ipcMain.handle(IPC_CHANNELS.GET_XP_EVENTS, async () => {
    const db = getDatabase();
    return db.prepare("SELECT * FROM xp_events ORDER BY timestamp DESC LIMIT 50").all();
  });

  ipcMain.handle(IPC_CHANNELS.GET_ACHIEVEMENTS, async () => {
    const db = getDatabase();
    return db.prepare("SELECT * FROM achievements ORDER BY unlocked DESC, title ASC").all();
  });

  // --- Search ---
  ipcMain.handle(IPC_CHANNELS.SEARCH, async (_event, query: string) => {
    const db = getDatabase();
    const q = `%${query}%`;
    const games = db.prepare("SELECT id, title, platform, cover FROM games WHERE title LIKE ? LIMIT 10").all(q);
    return { games };
  });

  // --- File dialogs ---
  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] });
    return result.canceled ? null : result.filePaths[0];
  });

  // --- Platform info ---
  ipcMain.handle(IPC_CHANNELS.GET_PLATFORM, () => process.platform);

  // --- Updates ---
  ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES, () => { checkForUpdates(); });
  ipcMain.handle(IPC_CHANNELS.DOWNLOAD_UPDATE, () => { downloadUpdate(); });
  ipcMain.handle(IPC_CHANNELS.INSTALL_UPDATE, () => { installUpdate(); });

  // --- Open external links ---
  ipcMain.handle(IPC_CHANNELS.OPEN_EXTERNAL, async (_event, url: string) => {
    await shell.openExternal(url);
  });

  // --- Logging from renderer ---
  ipcMain.on("renderer:log", (_event, level: string, ...args: any[]) => {
    const msg = args.map((a: any) => typeof a === "string" ? a : JSON.stringify(a)).join(" ");
    (log as any)[level]?.("[renderer]", msg);
  });
}
