export type Page =
  | "home"
  | "library"
  | "social"
  | "messages"
  | "parties"
  | "profile"
  | "discover"
  | "settings";

export interface Game {
  id: string;
  title: string;
  cover: string | null;
  developer: string;
  platform: "Steam" | "Epic" | "Xbox" | "Battle.net" | "Minecraft" | "EA" | "Ubisoft" | "Other";
  installPath: string;
  hoursPlayed: number;
  achievements: number;
  totalAchievements: number;
  lastPlayed: string | null;
  launcherId: string | null;
}

export interface User {
  id: string;
  username: string;
  avatar: string | null;
  xp: number;
  level: number;
  status: "online" | "idle" | "dnd" | "offline";
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  image?: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  messages: Message[];
  typing: boolean;
  online: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt: number | null;
}

export interface XpEvent {
  id: string;
  action: string;
  xp: number;
  timestamp: number;
}

export interface AppInfo {
  name: string;
  version: string;
  electron: string;
  chrome: string;
  node: string;
  platform: string;
  arch: string;
  userData: string;
  logs: string;
}

export interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
}

export interface Settings {
  theme: "light" | "dark";
  language: string;
  launchOnStartup: boolean;
  minimizeToTray: boolean;
  notificationsEnabled: boolean;
  connectedAccounts: string[];
  autoUpdateEnabled: boolean;
}

// IPC channel names
export const IPC_CHANNELS = {
  // Window controls
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  WINDOW_IS_MAXIMIZED: "window:isMaximized",
  WINDOW_ON_MAXIMIZE_CHANGE: "window:onMaximizeChange",

  // App info
  GET_APP_INFO: "app:getInfo",

  // Game detection
  SCAN_GAMES: "games:scan",
  GET_GAMES: "games:getAll",
  GET_GAME: "games:get",
  LAUNCH_GAME: "games:launch",

  // Settings
  GET_SETTINGS: "settings:get",
  UPDATE_SETTINGS: "settings:update",

  // User data
  GET_USER: "user:get",
  GET_XP_EVENTS: "xp:getEvents",
  GET_ACHIEVEMENTS: "achievements:getAll",

  // Search
  SEARCH: "search:query",

  // File dialogs
  SELECT_DIRECTORY: "dialog:selectDirectory",

  // Platform info
  GET_PLATFORM: "platform:get",

  // Updates
  CHECK_FOR_UPDATES: "update:check",
  DOWNLOAD_UPDATE: "update:download",
  INSTALL_UPDATE: "update:install",

  // External links
  OPEN_EXTERNAL: "shell:openExternal",

  // Renderer logging
  RENDERER_LOG: "renderer:log",
} as const;
