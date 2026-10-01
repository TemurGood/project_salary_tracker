// server/src/app.js
import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
// 🔥 ДОБАВЬ ЭТУ СТРОКУ:
import authRouter from './routes/auth.js';
// Импорт маршрутов
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';

// Создаём Express-приложение
const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin, // Разрешаем запросы только с фронтенда
  credentials: true,
}));

app.use(express.json()); // Парсинг JSON из тела запроса

// Базовый маршрут для проверки работоспособности
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Salary Tracker API работает',
    version: '1.0.0',
  });
});

// 🔥 ДОБАВЬ ЭТУ СТРОКУ (перед другими маршрутами):
app.use('/api/v1/auth', authRouter);

// Подключение маршрутов
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Обработчик для несуществующих маршрутов (404)
app.use(notFoundHandler);

// Централизованный обработчик ошибок
app.use(errorHandler);

export default app;