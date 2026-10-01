// server/src/db/connection.js
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { config } from '../config/index.js';

// Эмуляция __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализируем базу данных
const db = new sqlite3.Database(config.dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('✅ Подключено к базе данных SQLite:', config.dbPath);
    
    // Читаем и выполняем SQL-скрипт для создания таблиц
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schemaSql, (err) => {
      if (err) {
        console.error('❌ Ошибка выполнения SQL-скрипта:', err.message);
      } else {
        console.log('✅ Таблицы базы данных успешно созданы или уже существуют');
      }
    });
  }
});

export default db;