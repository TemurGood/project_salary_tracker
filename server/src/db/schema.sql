-- Включаем поддержку внешних ключей в SQLite
PRAGMA foreign_keys = ON;

-- 1. Таблица пользователей (должна быть ПЕРВОЙ, так как на неё ссылаются другие таблицы)
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Таблица для доходов
CREATE TABLE IF NOT EXISTS incomes (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  amount      REAL NOT NULL CHECK(amount > 0),
  date        TEXT NOT NULL,
  category    TEXT NOT NULL,
  comment     TEXT DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Таблица для расходов
CREATE TABLE IF NOT EXISTS expenses (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  amount        REAL NOT NULL CHECK(amount > 0),
  date          TEXT NOT NULL,
  category      TEXT NOT NULL,
  comment       TEXT DEFAULT '',
  is_recurring  INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);