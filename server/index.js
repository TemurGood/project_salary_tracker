// server/index.js
import app from './src/app.js';
import { config } from './src/config/index.js';

// Запускаем сервер
app.listen(config.port, () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 Salary Tracker API запущен!');
  console.log(`📡 Сервер слушает порт: ${config.port}`);
  console.log(`🌐 URL: http://localhost:${config.port}`);
  console.log(`🔗 CORS разрешён для: ${config.corsOrigin}`);
  console.log('========================================');
  console.log('');
  console.log('📋 Доступные эндпоинты:');
  console.log(`   GET    http://localhost:${config.port}/api/v1/incomes`);
  console.log(`   GET    http://localhost:${config.port}/api/v1/expenses`);
  console.log(`   GET    http://localhost:${config.port}/api/v1/summary/balance`);
  console.log(`   GET    http://localhost:${config.port}/api/v1/summary/by-category`);
  console.log(`   GET    http://localhost:${config.port}/api/v1/summary/by-month`);
  console.log('');
});