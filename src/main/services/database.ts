import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath("userData"), "gvmer.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
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
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY DEFAULT 'default',
      username TEXT NOT NULL DEFAULT 'gvmer',
      avatar TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      status TEXT DEFAULT 'online'
    );

    CREATE TABLE IF NOT EXISTS xp_events (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      xp INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      xp INTEGER DEFAULT 0,
      unlocked INTEGER DEFAULT 0,
      unlocked_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      peer_id TEXT NOT NULL,
      peer_username TEXT NOT NULL,
      peer_avatar TEXT,
      last_message TEXT,
      last_message_at INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT,
      image TEXT,
      timestamp INTEGER NOT NULL,
      read INTEGER DEFAULT 0,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default user if not exists
  const userExists = db.prepare("SELECT id FROM user_profile WHERE id = 'default'").get();
  if (!userExists) {
    db.prepare("INSERT INTO user_profile (id, username, xp, level) VALUES ('default', 'gvmer', 28450, 24)").run();
  }

  // Seed default achievements
  const achievementCount = db.prepare("SELECT COUNT(*) as count FROM achievements").get() as { count: number };
  if (achievementCount.count === 0) {
    const insert = db.prepare(
      "INSERT INTO achievements (id, title, description, icon, xp, unlocked, unlocked_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    const seed = [
      ["a1", "First Steps", "Play your first game", "🎮", 100, 1, Date.now() - 86400000 * 30],
      ["a2", "Dedicated", "Play 100 hours total", "⏱️", 500, 1, Date.now() - 86400000 * 20],
      ["a3", "Social Butterfly", "Add 10 friends", "🦋", 300, 1, Date.now() - 86400000 * 15],
      ["a4", "Completionist", "100% a game", "🏆", 1000, 1, Date.now() - 86400000 * 10],
      ["a5", "Veteran", "Play 500 hours total", "⭐", 2000, 0, null],
      ["a6", "Variety Seeker", "Play 10 different games", "🎯", 750, 0, null],
      ["a7", "Legendary", "Reach level 50", "👑", 5000, 0, null],
    ];
    const tx = db.transaction(() => {
      for (const row of seed) {
        insert.run(...row);
      }
    });
    tx();
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
