import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getDatabase } from "./database";
import type { Game } from "../../shared/types";

export function scanForGames(): Game[] {
  const db = getDatabase();
  const discovered: Game[] = [];

  // Scan Steam
  const steamPaths = getSteamPaths();
  for (const steamPath of steamPaths) {
    if (!fs.existsSync(steamPath)) continue;
    try {
      const entries = fs.readdirSync(steamPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const appManifestPath = path.join(steamPath, `appmanifest_${entry.name}.acf`);
          // check common subdirectories
          const commonPath = path.join(steamPath, "common", entry.name);
          if (fs.existsSync(commonPath)) {
            const game = createGameFromPath(entry.name, commonPath, "Steam");
            if (game) discovered.push(game);
          }
        }
      }
    } catch {
      // skip inaccessible paths
    }
  }

  // Scan common Steam library folders
  const commonSteamPaths = [
    `${process.env.PROGRAMFILES?.replace(/\\/g, "/") || "C:/Program Files"}/Steam/steamapps/common`,
    `${process.env["PROGRAMFILES(X86)"]?.replace(/\\/g, "/") || "C:/Program Files (x86)"}/Steam/steamapps/common`,
  ];

  for (const sp of commonSteamPaths) {
    if (!fs.existsSync(sp)) continue;
    try {
      const entries = fs.readdirSync(sp, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const existing = discovered.find((g) => g.title === entry.name);
          if (!existing) {
            const game = createGameFromPath(entry.name, path.join(sp, entry.name), "Steam");
            if (game) discovered.push(game);
          }
        }
      }
    } catch {
      // skip
    }
  }

  // Store discovered games in database
  const upsert = db.prepare(`
    INSERT INTO games (id, title, cover, developer, platform, install_path, hours_played, last_played)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET install_path = excluded.install_path
  `);

  const tx = db.transaction(() => {
    for (const game of discovered) {
      upsert.run(
        game.id,
        game.title,
        game.cover,
        game.developer,
        game.platform,
        game.installPath,
        game.hoursPlayed,
        game.lastPlayed
      );
    }
  });
  tx();

  return discovered;
}

function getSteamPaths(): string[] {
  const paths: string[] = [];
  const base = `${process.env["PROGRAMFILES(X86)"]?.replace(/\\/g, "/") || "C:/Program Files (x86)"}/Steam`;
  const configPath = path.join(base, "config", "config.vdf");

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf-8");
      const matches = content.match(/"BaseInstallFolder_\d+"\s+"([^"]+)"/g);
      if (matches) {
        for (const match of matches) {
          const folder = match.match(/"([^"]+)"$/)?.[1];
          if (folder) {
            paths.push(path.join(folder.replace(/\\\\/g, "/"), "steamapps", "common"));
          }
        }
      }
    } catch {
      // skip
    }
  }

  paths.push(path.join(base, "steamapps", "common"));
  return paths;
}

function createGameFromPath(name: string, fullPath: string, platform: string): Game | null {
  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) return null;

    const executable = findExecutable(fullPath);

    return {
      id: `${platform.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, "-")}`,
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
    // Look for common executable patterns
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
  const db = getDatabase();
  const rows = db.prepare("SELECT * FROM games ORDER BY last_played DESC").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    cover: r.cover,
    developer: r.developer,
    platform: r.platform,
    installPath: r.install_path,
    hoursPlayed: r.hours_played,
    achievements: r.achievements || 0,
    totalAchievements: r.total_achievements || 0,
    lastPlayed: r.last_played,
    launcherId: r.launcher_id,
  }));
}
