import fs from "fs";
import path from "path";

export function scanForGames(): any[] {
  const discovered: any[] = [];
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

  return discovered;
}

function createGameFromPath(name: string, fullPath: string, platform: string): any | null {
  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) return null;

    const id = `${platform.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const executable = findExecutable(fullPath);

    return {
      id,
      title: name,
      cover: null,
      cover_image: null,
      hero_image: null,
      developer: "",
      platform,
      install_path: fullPath,
      hours_played: 0,
      achievements: 0,
      total_achievements: 0,
      last_played: null,
      launcher_id: executable || null,
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
