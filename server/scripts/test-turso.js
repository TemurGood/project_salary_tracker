// server/scripts/test-turso.js
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('❌ Ошибка: TURSO_DATABASE_URL не указан!');
  console.error('Добавьте TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в server/.env');
  process.exit(1);
}

console.log(`🔍 Проверка подключения к Turso (${tursoUrl})...`);

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken || undefined,
});

try {
  const result = await client.execute('SELECT 1 as connected');
  if (result.rows.length > 0 && result.rows[0].connected === 1) {
    console.log('✅ Подключение к Turso успешно установлено!');
  }

  // Проверяем таблицы
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  console.log('📋 Таблицы в базе данных:');
  for (const t of tables.rows) {
    const countRes = await client.execute(`SELECT COUNT(*) as count FROM ${t.name}`);
    console.log(`   - ${t.name}: ${countRes.rows[0].count} записей`);
  }
} catch (error) {
  console.error('❌ Ошибка при проверке подключения:', error.message);
  process.exit(1);
}
