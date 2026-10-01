// server/src/middleware/errorHandler.js

// Централизованный обработчик ошибок
export const errorHandler = (err, req, res, next) => {
  // Логируем ошибку в консоль для разработки
  console.error('❌ Ошибка:', err.message);
  console.error(err.stack);
  
  // Определяем статус-код (по умолчанию 500 - внутренняя ошибка сервера)
  const statusCode = err.statusCode || 500;
  
  // Определяем сообщение ошибки
  const message = err.message || 'Внутренняя ошибка сервера';
  
  // Формируем единый формат ответа
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message: message,
    },
  });
};

// Обработчик для несуществующих маршрутов (404)
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Маршрут не найден: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};