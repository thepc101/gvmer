export const NAV_ITEMS: { label: string; page: import("./types").Page }[] = [
  { label: "Home", page: "home" },
  { label: "Library", page: "library" },
  { label: "Social", page: "social" },
  { label: "Messages", page: "messages" },
  { label: "Parties", page: "parties" },
  { label: "Profile", page: "profile" },
  { label: "Discover", page: "discover" },
  { label: "Settings", page: "settings" },
];

export const PLATFORM_COLORS: Record<string, string> = {
  Steam: "#171a21",
  Epic: "#313131",
  Xbox: "#107c10",
  "Battle.net": "#148eff",
  Minecraft: "#4a9c2d",
  EA: "#ea161f",
  Ubisoft: "#003cb1",
};

export const KNOWN_LAUNCHER_PATHS = {
  win32: {
    Steam: [
      `${process.env.PROGRAMFILES?.replace(/\\/g, "/") || "C:/Program Files"}/Steam/steamapps/common`,
      `${process.env["PROGRAMFILES(X86)"]?.replace(/\\/g, "/") || "C:/Program Files (x86)"}/Steam/steamapps/common`,
    ],
    Epic: [
      `${process.env.PROGRAMDATA?.replace(/\\/g, "/") || "C:/ProgramData"}/Epic/EpicGamesLauncher/Data/Manifests`,
    ],
    Xbox: [`${process.env.LOCALAPPDATA?.replace(/\\/g, "/") || ""}/Packages`],
  },
};

export const XP_RATES = {
  PER_MINUTE_PLAYED: 2,
  ACHIEVEMENT_UNLOCK: 250,
  GAME_COMPLETION: 1000,
  PLAY_WITH_FRIEND_BONUS: 75,
  NEW_GENRE_BONUS: 150,
  DAILY_LOGIN: 50,
  STREAK_BONUS: 100,
};
