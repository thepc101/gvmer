const MOCK_GAMES = [
  { id: "steam-elden-ring", title: "Elden Ring", cover: null, cover_image: null, hero_image: null, developer: "FromSoftware", platform: "Steam", install_path: "", hours_played: 342, achievements: 42, total_achievements: 42, last_played: "2026-06-28", launcher_id: null },
  { id: "steam-balatro", title: "Balatro", cover: null, cover_image: null, hero_image: null, developer: "LocalThunk", platform: "Steam", install_path: "", hours_played: 89, achievements: 15, total_achievements: 30, last_played: "2026-06-29", launcher_id: null },
  { id: "epic-cyberpunk", title: "Cyberpunk 2077", cover: null, cover_image: null, hero_image: null, developer: "CD Projekt Red", platform: "Epic", install_path: "", hours_played: 156, achievements: 34, total_achievements: 57, last_played: "2026-06-25", launcher_id: null },
  { id: "steam-hades-ii", title: "Hades II", cover: null, cover_image: null, hero_image: null, developer: "Supergiant Games", platform: "Steam", install_path: "", hours_played: 67, achievements: 22, total_achievements: 40, last_played: "2026-06-27", launcher_id: null },
  { id: "xbox-gears", title: "Gears of War", cover: null, cover_image: null, hero_image: null, developer: "The Coalition", platform: "Xbox", install_path: "", hours_played: 210, achievements: 56, total_achievements: 70, last_played: "2026-06-20", launcher_id: null },
  { id: "battlenet-overwatch", title: "Overwatch 2", cover: null, cover_image: null, hero_image: null, developer: "Blizzard Entertainment", platform: "Battle.net", install_path: "", hours_played: 890, achievements: 78, total_achievements: 100, last_played: "2026-06-29", launcher_id: null },
  { id: "minecraft-minecraft", title: "Minecraft", cover: null, cover_image: null, hero_image: null, developer: "Mojang Studios", platform: "Minecraft", install_path: "", hours_played: 1200, achievements: 62, total_achievements: 125, last_played: "2026-06-15", launcher_id: null },
  { id: "ea-fc-25", title: "EA Sports FC 25", cover: null, cover_image: null, hero_image: null, developer: "EA Sports", platform: "EA", install_path: "", hours_played: 45, achievements: 12, total_achievements: 40, last_played: "2026-06-22", launcher_id: null },
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
  if (window.gvmer) return;

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
    addGameManual: async () => { await delay(200); const g = { id: "manual-" + Date.now(), title: "Custom Game", cover: null, cover_image: null, hero_image: null, developer: "You", platform: "Other", install_path: "C:\\Games\\custom.exe", hours_played: 0, achievements: 0, total_achievements: 0, last_played: null, launcher_id: null }; MOCK_GAMES.push(g); return g; },
    deleteGame: async (id: string) => { const i = MOCK_GAMES.findIndex((g) => g.id === id); if (i >= 0) MOCK_GAMES.splice(i, 1); return { success: true }; },
    updateGameImage: async (gameId: string, type: string) => { await delay(300); const p = "C:\\Users\\gvmer\\AppData\\Roaming\\gvmer\\images\\" + gameId + "-" + type + ".png"; const g = MOCK_GAMES.find((g) => g.id === gameId); if (g) (g as any)[type] = p; return { path: p }; },
    getSettings: async () => ({ theme: "light", language: "en", launchOnStartup: false, minimizeToTray: true, notificationsEnabled: true, connectedAccounts: ["Steam", "Discord"], autoUpdateEnabled: true }),
    updateSettings: async () => ({ success: true }),
    getUser: async () => { await delay(50); return MOCK_USER; },
    updateUser: async (updates: Record<string, any>) => { Object.assign(MOCK_USER, updates); return MOCK_USER; },
    getXpEvents: async () => { await delay(50); return MOCK_XP_EVENTS; },
    getAchievements: async () => { await delay(50); return MOCK_ACHIEVEMENTS; },
    deleteAccount: async () => { MOCK_GAMES.length = 0; MOCK_GAMES.push(...MOCK_GAMES); return { success: true }; },
    search: async (q: string) => {
      await delay(100);
      return { games: MOCK_GAMES.filter((g) => g.title.toLowerCase().includes(q.toLowerCase())) };
    },
    selectDirectory: async () => null,
    selectFile: async () => "C:\\Users\\gvmer\\Downloads\\game.exe",
    selectImage: async () => "C:\\Users\\gvmer\\Pictures\\cover.png",
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
