import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";
import { app } from "electron";
import { getLogger } from "./logger";

let db: SqlJsDatabase | null = null;
let dbPath: string = "";

export async function initDatabase() {
  const SQL = await initSqlJs();
  dbPath = path.join(app.getPath("userData"), "gvmer.db");

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  db.run("PRAGMA journal_mode=WAL");
  initializeSchema(db);

  // Seed default data
  seedDefaults(db);

  const log = getLogger();
  log.info(`[database] Initialized at ${dbPath}`);
}

function initializeSchema(db: SqlJsDatabase) {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      cover TEXT,
      developer TEXT,
      platform TEXT NOT NULL,
      install_path TEXT,
      hours_played REAL DEFAULT 0,
      achievements INTEGER DEFAULT 0,
      total_achievements INTEGER DEFAULT 0,
      last_played TEXT,
      launcher_id TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY DEFAULT 'default',
      username TEXT NOT NULL DEFAULT 'gvmer',
      avatar TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      status TEXT DEFAULT 'online'
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS xp_events (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      xp INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      xp INTEGER DEFAULT 0,
      unlocked INTEGER DEFAULT 0,
      unlocked_at INTEGER
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

function seedDefaults(db: SqlJsDatabase) {
  const userCount = db.exec("SELECT COUNT(*) as c FROM user_profile");
  if (!userCount.length || !userCount[0].values.length || userCount[0].values[0][0] === 0) {
    db.run("INSERT INTO user_profile (id, username, xp, level) VALUES ('default', 'gvmer', 28450, 24)");
  }

  const achCount = db.exec("SELECT COUNT(*) as c FROM achievements");
  if (!achCount.length || !achCount[0].values.length || achCount[0].values[0][0] === 0) {
    const seed = [
      ["a1", "First Steps", "Play your first game", "🎮", 100, 1, Date.now() - 86400000 * 30],
      ["a2", "Dedicated", "Play 100 hours total", "⏱️", 500, 1, Date.now() - 86400000 * 20],
      ["a3", "Social Butterfly", "Add 10 friends", "🦋", 300, 1, Date.now() - 86400000 * 15],
      ["a4", "Completionist", "100% a game", "🏆", 1000, 1, Date.now() - 86400000 * 10],
      ["a5", "Veteran", "Play 500 hours total", "⭐", 2000, 0, null],
      ["a6", "Variety Seeker", "Play 10 different games", "🎯", 750, 0, null],
      ["a7", "Legendary", "Reach level 50", "👑", 5000, 0, null],
    ];
    for (const row of seed) {
      db.run(
        "INSERT INTO achievements (id, title, description, icon, xp, unlocked, unlocked_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        row
      );
    }
  }
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error("Database not initialized. Call initDatabase() first.");
  return db;
}

export function saveDatabase() {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export function closeDatabase() {
  saveDatabase();
  if (db) {
    db.close();
    db = null;
  }
}

export function query(sql: string, params?: any[]): any[] {
  const d = getDb();
  const stmt = d.prepare(sql);
  if (params) stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function queryOne(sql: string, params?: any[]): any | null {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

export function execute(sql: string, params?: any[]) {
  const d = getDb();
  if (params) {
    d.run(sql, params);
  } else {
    d.run(sql);
  }
  saveDatabase();
}
