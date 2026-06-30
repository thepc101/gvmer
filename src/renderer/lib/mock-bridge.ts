// Provides mock implementations for `window.gvmer` when running
// outside Electron (e.g. in a browser during development).

const MOCK_GAMES = [
  { id: "steam-elden-ring", title: "Elden Ring", cover: null, developer: "FromSoftware", platform: "Steam", installPath: "", hoursPlayed: 342, achievements: 42, totalAchievements: 42, lastPlayed: "2026-06-28", launcherId: null },
  { id: "steam-balatro", title: "Balatro", cover: null, developer: "LocalThunk", platform: "Steam", installPath: "", hoursPlayed: 89, achievements: 15, totalAchievements: 30, lastPlayed: "2026-06-29", launcherId: null },
  { id: "epic-cyberpunk", title: "Cyberpunk 2077", cover: null, developer: "CD Projekt Red", platform: "Epic", installPath: "", hoursPlayed: 156, achievements: 34, totalAchievements: 57, lastPlayed: "2026-06-25", launcherId: null },
  { id: "steam-hades-ii", title: "Hades II", cover: null, developer: "Supergiant Games", platform: "Steam", installPath: "", hoursPlayed: 67, achievements: 22, totalAchievements: 40, lastPlayed: "2026-06-27", launcherId: null },
  { id: "xbox-gears", title: "Gears of War", cover: null, developer: "The Coalition", platform: "Xbox", installPath: "", hoursPlayed: 210, achievements: 56, totalAchievements: 70, lastPlayed: "2026-06-20", launcherId: null },
  { id: "battlenet-overwatch", title: "Overwatch 2", cover: null, developer: "Blizzard Entertainment", platform: "Battle.net", installPath: "", hoursPlayed: 890, achievements: 78, totalAchievements: 100, lastPlayed: "2026-06-29", launcherId: null },
  { id: "minecraft-minecraft", title: "Minecraft", cover: null, developer: "Mojang Studios", platform: "Minecraft", installPath: "", hoursPlayed: 1200, achievements: 62, totalAchievements: 125, lastPlayed: "2026-06-15", launcherId: null },
  { id: "ea-fc-25", title: "EA Sports FC 25", cover: null, developer: "EA Sports", platform: "EA", installPath: "", hoursPlayed: 45, achievements: 12, totalAchievements: 40, lastPlayed: "2026-06-22", launcherId: null },
];

const MOCK_USER = { id: "default", username: "gvmer", avatar: null, xp: 28450, level: 24, status: "online" };

const MOCK_ACHIEVEMENTS = [
  { id: "a1", title: "First Steps", description: "Play your first game", icon: "🎮", xp: 100, unlocked: true, unlocked_at: Date.now() - 86400000 * 30 },
  { id: "a2", title: "Dedicated", description: "Play 100 hours total", icon: "⏱️", xp: 500, unlocked: true, unlocked_at: Date.now() - 86400000 * 20 },
  { id: "a3", title: "Social Butterfly", description: "Add 10 friends", icon: "🦋", xp: 300, unlocked: true, unlocked_at: Date.now() - 86400000 * 15 },
  { id: "a4", title: "Completionist", description: "100% a game", icon: "🏆", xp: 1000, unlocked: true, unlocked_at: Date.now() - 86400000 * 10 },
  { id: "a5", title: "Veteran", description: "Play 500 hours total", icon: "⭐", xp: 2000, unlocked: false, unlocked_at: null },
  { id: "a6", title: "Variety Seeker", description: "Play 10 different games", icon: "🎯", xp: 750, unlocked: false, unlocked_at: null },
  { id: "a7", title: "Legendary", description: "Reach level 50", icon: "👑", xp: 5000, unlocked: false, unlocked_at: null },
];

const MOCK_XP_EVENTS = [
  { id: "x1", action: "Played Elden Ring", xp: 45, timestamp: Date.now() - 7200000 },
  { id: "x2", action: "Achievement: Elden Lord", xp: 250, timestamp: Date.now() - 14400000 },
  { id: "x3", action: "Played with friends", xp: 75, timestamp: Date.now() - 18000000 },
  { id: "x4", action: "Daily login bonus", xp: 50, timestamp: Date.now() - 28800000 },
  { id: "x5", action: "Finished Balatro run", xp: 30, timestamp: Date.now() - 86400000 },
];

function noop() {}
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function installMockBridge() {
  if (window.gvmer) return; // already have real bridge

  const mock = {
    minimize: noop as any,
    maximize: noop as any,
    close: noop as any,
    isMaximized: async () => false,
    onMaximizeChange: () => noop,
    getAppInfo: async () => ({
      name: "gvmer", version: "1.0.0-dev", electron: "mock", chrome: "mock", node: "mock",
      platform: "win32", arch: "x64", userData: "", logs: "",
    }),
    scanGames: async () => { await delay(500); return MOCK_GAMES; },
    getGames: async () => { await delay(100); return MOCK_GAMES; },
    getGame: async (id: string) => { await delay(50); return MOCK_GAMES.find((g) => g.id === id) || MOCK_GAMES[0]; },
    launchGame: async () => ({ success: false, error: "No Electron runtime" }),
    getSettings: async () => ({ theme: "light", language: "en", launchOnStartup: false, minimizeToTray: true, notificationsEnabled: true, connectedAccounts: ["Steam", "Discord"], autoUpdateEnabled: true }),
    updateSettings: async () => ({ success: true }),
    getUser: async () => { await delay(50); return MOCK_USER; },
    getXpEvents: async () => { await delay(50); return MOCK_XP_EVENTS; },
    getAchievements: async () => { await delay(50); return MOCK_ACHIEVEMENTS; },
    search: async (q: string) => {
      await delay(100);
      return { games: MOCK_GAMES.filter((g) => g.title.toLowerCase().includes(q.toLowerCase())) };
    },
    selectDirectory: async () => null,
    getPlatform: async () => "win32",
    checkForUpdates: noop as any,
    downloadUpdate: noop as any,
    installUpdate: noop as any,
    onUpdateChecking: () => noop,
    onUpdateAvailable: () => noop,
    onUpdateNotAvailable: () => noop,
    onUpdateProgress: () => noop,
    onUpdateDownloaded: () => noop,
    onUpdateError: () => noop,
    onGamesScanned: () => noop,
    openExternal: async () => {},
    log: (() => {}) as any,
    onSearchShortcut: () => noop,
    onSettingsShortcut: () => noop,
  };

  window.gvmer = mock as any;
}
