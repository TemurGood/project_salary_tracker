// server/src/db/connection.js
import { createClient } from '@libsql/client';
import { config } from '../config/index.js';
import { schemaSql } from './schema.js';

const isTurso = Boolean(config.tursoUrl);

// URL для подключения: если указан TURSO_DATABASE_URL - используем его, иначе локальный SQLite файл
const dbUrl = isTurso ? config.tursoUrl : `file:${config.dbPath}`;

console.log(`🔌 Подключение к базе данных: ${isTurso ? 'Turso Cloud (' + dbUrl + ')' : 'Локальный SQLite (' + dbUrl + ')'}`);

export const client = createClient({
  url: dbUrl,
  authToken: config.tursoAuthToken || undefined,
});

// Адаптер для обратной совместимости с существующим кодом (sqlite3-подобный интерфейс)
const db = {
  rawClient: client,

  run(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    client.execute({ sql, args: params || [] })
      .then((res) => {
        const ctx = {
          changes: res.rowsAffected,
          lastID: res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : undefined,
        };
        if (callback) callback.call(ctx, null);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },

  get(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    client.execute({ sql, args: params || [] })
      .then((res) => {
        const row = res.rows && res.rows.length > 0 ? { ...res.rows[0] } : null;
        if (callback) callback(null, row);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },

  all(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    client.execute({ sql, args: params || [] })
      .then((res) => {
        const rows = res.rows ? res.rows.map((row) => ({ ...row })) : [];
        if (callback) callback(null, rows);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },

  exec(sql, callback) {
    client.executeMultiple(sql)
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },
};

// Инициализация таблиц базы данных
let schemaInitPromise = null;
export const initSchema = () => {
  if (!schemaInitPromise) {
    schemaInitPromise = client.executeMultiple(schemaSql)
      .then(() => {
        console.log('✅ Таблицы базы данных успешно инициализированы');
      })
      .catch((err) => {
        console.error('❌ Ошибка инициализации схемы базы данных:', err.message);
      });
  }
  return schemaInitPromise;
};

// Запускаем инициализацию при импорте модуля
initSchema();

export default db;