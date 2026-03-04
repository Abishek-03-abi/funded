const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'propfirm.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    account_size INTEGER NOT NULL,
    fee REAL NOT NULL,
    status TEXT DEFAULT 'active',
    balance REAL,
    equity REAL,
    profit REAL DEFAULT 0,
    daily_loss_used REAL DEFAULT 0,
    max_drawdown_used REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER REFERENCES challenges(id),
    pair TEXT NOT NULL,
    type TEXT NOT NULL,
    lot_size REAL NOT NULL,
    entry_price REAL NOT NULL,
    exit_price REAL,
    pnl REAL DEFAULT 0,
    status TEXT DEFAULT 'open',
    opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME
  );
`);

module.exports = db;
