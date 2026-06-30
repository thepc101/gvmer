import { autoUpdater } from "electron-updater";
import { BrowserWindow } from "electron";
import { getLogger } from "./logger";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

export function initAutoUpdater(mainWindow: BrowserWindow) {
  const log = getLogger();

  autoUpdater.logger = log;

  autoUpdater.on("checking-for-update", () => {
    log.info("[updater] Checking for updates...");
    mainWindow.webContents.send("update:checking");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("[updater] Update available:", info.version);
    mainWindow.webContents.send("update:available", {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("[updater] No updates available.");
    mainWindow.webContents.send("update:not-available");
  });

  autoUpdater.on("download-progress", (progress) => {
    mainWindow.webContents.send("update:progress", {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      total: progress.total,
      transferred: progress.transferred,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("[updater] Update downloaded:", info.version);
    mainWindow.webContents.send("update:downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (err) => {
    log.error("[updater] Error:", err.message);
    mainWindow.webContents.send("update:error", err.message);
  });

  // Check for updates after a short delay
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      log.warn("[updater] Initial check failed:", err.message);
    });
  }, 10000);
}

export function downloadUpdate() {
  autoUpdater.downloadUpdate();
}

export function installUpdate() {
  autoUpdater.quitAndInstall();
}

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
