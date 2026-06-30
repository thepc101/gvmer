export interface GvmerAPI {
  // Window
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMaximizeChange: (callback: (maximized: boolean) => void) => () => void;

  // App info
  getAppInfo: () => Promise<{
    name: string;
    version: string;
    electron: string;
    chrome: string;
    node: string;
    platform: string;
    arch: string;
    userData: string;
    logs: string;
  }>;

  // Games
  scanGames: () => Promise<any[]>;
  getGames: () => Promise<any[]>;
  getGame: (id: string) => Promise<any>;
  launchGame: (installPath: string, launcherId?: string) => Promise<{ success: boolean; error?: string }>;

  // Settings
  getSettings: () => Promise<Record<string, any>>;
  updateSettings: (key: string, value: any) => Promise<{ success: boolean }>;

  // User
  getUser: () => Promise<any>;
  getXpEvents: () => Promise<any[]>;
  getAchievements: () => Promise<any[]>;

  // Search
  search: (query: string) => Promise<{ games: any[] }>;

  // Dialogs
  selectDirectory: () => Promise<string | null>;

  // Platform
  getPlatform: () => Promise<string>;

  // Updates
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  onUpdateChecking: (callback: () => void) => () => void;
  onUpdateAvailable: (callback: (info: any) => void) => () => void;
  onUpdateNotAvailable: (callback: () => void) => () => void;
  onUpdateProgress: (callback: (progress: any) => void) => () => void;
  onUpdateDownloaded: (callback: (info: any) => void) => () => void;
  onUpdateError: (callback: (error: string) => void) => () => void;
  onGamesScanned: (callback: (count: number) => void) => () => void;

  // External
  openExternal: (url: string) => Promise<void>;

  // Logging
  log: (level: string, ...args: any[]) => void;

  // Shortcuts
  onSearchShortcut: (callback: () => void) => () => void;
  onSettingsShortcut: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    gvmer: GvmerAPI;
  }
}
