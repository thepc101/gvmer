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
  cover_image: string | null;
  hero_image: string | null;
  developer: string;
  platform: string;
  install_path: string;
  hours_played: number;
  achievements: number;
  total_achievements: number;
  last_played: string | null;
  launcher_id: string | null;
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

export const IPC_CHANNELS = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  WINDOW_IS_MAXIMIZED: "window:isMaximized",
  WINDOW_ON_MAXIMIZE_CHANGE: "window:onMaximizeChange",
  GET_APP_INFO: "app:getInfo",
  SCAN_GAMES: "games:scan",
  GET_GAMES: "games:getAll",
  GET_GAME: "games:get",
  LAUNCH_GAME: "games:launch",
  ADD_GAME_MANUAL: "games:addManual",
  DELETE_GAME: "games:delete",
  UPDATE_GAME_IMAGE: "games:updateImage",
  GET_SETTINGS: "settings:get",
  UPDATE_SETTINGS: "settings:update",
  DELETE_ACCOUNT: "account:delete",
  GET_USER: "user:get",
  UPDATE_USER: "user:update",
  GET_XP_EVENTS: "xp:getEvents",
  GET_ACHIEVEMENTS: "achievements:getAll",
  SEARCH: "search:query",
  SELECT_DIRECTORY: "dialog:selectDirectory",
  SELECT_FILE: "dialog:selectFile",
  SELECT_IMAGE: "dialog:selectImage",
  GET_PLATFORM: "platform:get",
  CHECK_FOR_UPDATES: "update:check",
  DOWNLOAD_UPDATE: "update:download",
  INSTALL_UPDATE: "update:install",
  OPEN_EXTERNAL: "shell:openExternal",
  RENDERER_LOG: "renderer:log",
} as const;
