import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execute, query } from "./database";
import type { Game } from "../../shared/types";

export function scanForGames(): Game[] {
  const discovered: Game[] = [];
  const seen = new Set<string>();

  const commonSteamPaths = [
    `${process.env.PROGRAMFILES?.replace(/\\/g, "/") || "C:/Program Files"}/Steam/steamapps/common`,
    `${process.env["PROGRAMFILES(X86)"]?.replace(/\\/g, "/") || "C:/Program Files (x86)"}/Steam/steamapps/common`,
  ];

  for (const sp of commonSteamPaths) {
    if (!fs.existsSync(sp)) continue;
    try {
      const entries = fs.readdirSync(sp, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !seen.has(entry.name.toLowerCase())) {
          seen.add(entry.name.toLowerCase());
          const game = createGameFromPath(entry.name, path.join(sp, entry.name), "Steam");
          if (game) discovered.push(game);
        }
      }
    } catch {}
  }

  // Store discovered games in database
  const existing = query("SELECT id FROM games");
  const existingIds = new Set(existing.map((r: any) => r.id));

  for (const game of discovered) {
    if (!existingIds.has(game.id)) {
      execute(
        "INSERT INTO games (id, title, cover, developer, platform, install_path, hours_played, last_played) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [game.id, game.title, game.cover, game.developer, game.platform, game.installPath, game.hoursPlayed, game.lastPlayed]
      );
    }
  }

  return discovered;
}

function createGameFromPath(name: string, fullPath: string, platform: string): Game | null {
  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) return null;

    const id = `${platform.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const executable = findExecutable(fullPath);

    return {
      id,
      title: name,
      cover: null,
      developer: "",
      platform: platform as Game["platform"],
      installPath: fullPath,
      hoursPlayed: 0,
      achievements: 0,
      totalAchievements: 0,
      lastPlayed: null,
      launcherId: executable || null,
    };
  } catch {
    return null;
  }
}

function findExecutable(dir: string): string | null {
  try {
    const files = fs.readdirSync(dir);
    const exe = files.find(
      (f) =>
        f.endsWith(".exe") &&
        !f.toLowerCase().includes("uninstall") &&
        !f.toLowerCase().includes("redist") &&
        !f.toLowerCase().includes("dxsetup") &&
        !f.toLowerCase().includes("vc_redist")
    );
    return exe ? path.join(dir, exe) : null;
  } catch {
    return null;
  }
}

export function getStoredGames(): Game[] {
  const rows = query("SELECT * FROM games ORDER BY last_played DESC") as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    cover: r.cover,
    developer: r.developer || "",
    platform: r.platform,
    installPath: r.install_path || "",
    hoursPlayed: r.hours_played || 0,
    achievements: r.achievements || 0,
    totalAchievements: r.total_achievements || 0,
    lastPlayed: r.last_played,
    launcherId: r.launcher_id,
  }));
}
