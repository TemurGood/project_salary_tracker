// server/src/config/index.js
import path from 'path';
import { fileURLToPath } from 'url';

// Эмуляция __dirname для ES-модулей (так как мы используем "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  // Порт, на котором будет работать бэкенд
  port: process.env.PORT || 3001,
  
  // Разрешённый адрес фронтенда (стандартный порт Vite)
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Путь к файлу базы данных (будет создан в корне папки server)
  dbPath: path.resolve(__dirname, '../../database.sqlite'),
  // 🔥 ДОБАВЬ ЭТУ СТРОКУ:
  // Секретный ключ для подписи JWT-токенов
  // В реальном проекте этот ключ хранят в переменной окружения (.env)
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-for-development-only-change-in-production',
  
  // Срок жизни токена (1 день)
  jwtExpiresIn: '1d',
};