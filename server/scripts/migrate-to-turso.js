// server/scripts/migrate-to-turso.js
import { createClient } from '@libsql/client';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { schemaSql } from '../src/db/schema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('❌ Ошибка: Переменная окружения TURSO_DATABASE_URL не задана!');
  console.error('👉 Укажите её в server/.env или в терминале:');
  console.error('   TURSO_DATABASE_URL=libsql://your-db.turso.io');
  console.error('   TURSO_AUTH_TOKEN=your-token');
  process.exit(1);
}

console.log('🚀 Начинаем миграцию данных в Turso...');
console.log(`🌐 Turso URL: ${tursoUrl}`);

const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken || undefined,
});

// Открываем локальную базу данных SQLite
const localDbPath = path.resolve(__dirname, '../database.sqlite');
console.log(`📂 Локальная база: ${localDbPath}`);

const localDb = new sqlite3.Database(localDbPath, sqlite3.OPEN_READONLY, async (err) => {
  if (err) {
    console.error('❌ Ошибка открытия локальной БД:', err.message);
    process.exit(1);
  }

  try {
    // 1. Создаём структуру таблиц на Turso
    console.log('🛠️  Создание таблиц на Turso...');
    await tursoClient.executeMultiple(schemaSql);
    console.log('✅ Таблицы созданы');

    // 2. Миграция пользователей
    const users = await new Promise((resolve, reject) => {
      localDb.all('SELECT * FROM users', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    console.log(`👤 Найдено пользователей: ${users.length}`);
    for (const u of users) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO users (id, email, password_hash, name, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [u.id, u.email, u.password_hash, u.name || '', u.created_at, u.updated_at],
      });
    }

    // 3. Миграция доходов
    const incomes = await new Promise((resolve, reject) => {
      localDb.all('SELECT * FROM incomes', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    console.log(`💵 Найдено записей доходов: ${incomes.length}`);
    for (const inc of incomes) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO incomes (id, user_id, amount, date, category, comment, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [inc.id, inc.user_id, inc.amount, inc.date, inc.category, inc.comment || '', inc.created_at, inc.updated_at],
      });
    }

    // 4. Миграция расходов
    const expenses = await new Promise((resolve, reject) => {
      localDb.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    console.log(`💳 Найдено записей расходов: ${expenses.length}`);
    for (const exp of expenses) {
      await tursoClient.execute({
        sql: `INSERT OR REPLACE INTO expenses (id, user_id, amount, date, category, comment, is_recurring, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [exp.id, exp.user_id, exp.amount, exp.date, exp.category, exp.comment || '', exp.is_recurring ? 1 : 0, exp.created_at, exp.updated_at],
      });
    }

    // 5. Проверка финальных данных
    const checkUsers = await tursoClient.execute('SELECT COUNT(*) as count FROM users');
    const checkIncomes = await tursoClient.execute('SELECT COUNT(*) as count FROM incomes');
    const checkExpenses = await tursoClient.execute('SELECT COUNT(*) as count FROM expenses');

    console.log('\n==============================================');
    console.log('🎉 Миграция в Turso успешно завершена!');
    console.log(`👥 Пользователей в Turso: ${checkUsers.rows[0].count}`);
    console.log(`📈 Доходов в Turso:       ${checkIncomes.rows[0].count}`);
    console.log(`📉 Расходов в Turso:      ${checkExpenses.rows[0].count}`);
    console.log('==============================================\n');

    localDb.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка во время миграции:', error);
    localDb.close();
    process.exit(1);
  }
});
