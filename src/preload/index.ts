import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "../shared/types";

const api = {
  // Window controls
  minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
  maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
  close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
  isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED),
  onMaximizeChange: (callback: (maximized: boolean) => void) => {
    const handler = (_event: any, value: boolean) => callback(value);
    ipcRenderer.on(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.WINDOW_ON_MAXIMIZE_CHANGE, handler);
  },

  // App info
  getAppInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_INFO),

  // Game detection
  scanGames: () => ipcRenderer.invoke(IPC_CHANNELS.SCAN_GAMES),
  getGames: () => ipcRenderer.invoke(IPC_CHANNELS.GET_GAMES),
  getGame: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_GAME, id),
  launchGame: (installPath: string, launcherId?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_GAME, installPath, launcherId),

  // Settings
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  updateSettings: (key: string, value: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_SETTINGS, key, value),

  // User data
  getUser: () => ipcRenderer.invoke(IPC_CHANNELS.GET_USER),
  getXpEvents: () => ipcRenderer.invoke(IPC_CHANNELS.GET_XP_EVENTS),
  getAchievements: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ACHIEVEMENTS),

  // Search
  search: (query: string) => ipcRenderer.invoke(IPC_CHANNELS.SEARCH, query),

  // Dialogs
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY),

  // Platform
  getPlatform: () => ipcRenderer.invoke(IPC_CHANNELS.GET_PLATFORM),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_FOR_UPDATES),
  downloadUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.DOWNLOAD_UPDATE),
  installUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.INSTALL_UPDATE),
  onUpdateChecking: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("update:checking", handler);
    return () => ipcRenderer.removeListener("update:checking", handler);
  },
  onUpdateAvailable: (callback: (info: any) => void) => {
    const handler = (_event: any, info: any) => callback(info);
    ipcRenderer.on("update:available", handler);
    return () => ipcRenderer.removeListener("update:available", handler);
  },
  onUpdateNotAvailable: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("update:not-available", handler);
    return () => ipcRenderer.removeListener("update:not-available", handler);
  },
  onUpdateProgress: (callback: (progress: any) => void) => {
    const handler = (_event: any, progress: any) => callback(progress);
    ipcRenderer.on("update:progress", handler);
    return () => ipcRenderer.removeListener("update:progress", handler);
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    const handler = (_event: any, info: any) => callback(info);
    ipcRenderer.on("update:downloaded", handler);
    return () => ipcRenderer.removeListener("update:downloaded", handler);
  },
  onUpdateError: (callback: (error: string) => void) => {
    const handler = (_event: any, error: string) => callback(error);
    ipcRenderer.on("update:error", handler);
    return () => ipcRenderer.removeListener("update:error", handler);
  },
  onGamesScanned: (callback: (count: number) => void) => {
    const handler = (_event: any, count: number) => callback(count);
    ipcRenderer.on("games:scanned", handler);
    return () => ipcRenderer.removeListener("games:scanned", handler);
  },

  // External links
  openExternal: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.OPEN_EXTERNAL, url),

  // Logging
  log: (level: string, ...args: any[]) => {
    ipcRenderer.send(IPC_CHANNELS.RENDERER_LOG, level, ...args);
  },

  // Shortcuts
  onSearchShortcut: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("shortcut:search", handler);
    return () => ipcRenderer.removeListener("shortcut:search", handler);
  },
  onSettingsShortcut: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("shortcut:settings", handler);
    return () => ipcRenderer.removeListener("shortcut:settings", handler);
  },
};

contextBridge.exposeInMainWorld("gvmer", api);
