// server/src/config/index.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Загружаем переменные из .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  // Порт, на котором будет работать бэкенд
  port: process.env.PORT || 3001,
  
  // Разрешённый адрес фронтенда (стандартный порт Vite или Vercel)
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Путь к локальному файлу базы данных SQLite
  dbPath: path.resolve(__dirname, '../../database.sqlite'),

  // Настройки Turso Database (libSQL)
  tursoUrl: process.env.TURSO_DATABASE_URL || '',
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN || '',

  // Секретный ключ для подписи JWT-токенов
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-for-development-only-change-in-production',
  
  // Срок жизни токена (1 день)
  jwtExpiresIn: '1d',
};