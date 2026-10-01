// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { findUserById } from '../services/userService.js';

/**
 * Middleware для проверки JWT-токена
 * Долен применяться к защищённым маршрутам
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // 1. Извлекаем токен из заголовка Authorization
    // Формат: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Берём часть после "Bearer "
    
    // 2. Если токена нет — отклоняем запрос
    if (!token) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Токен авторизации отсутствует',
        },
      });
    }
    
    // 3. Проверяем и расшифровываем токен
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      // Если токен недействителен или истёк
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: {
            code: 401,
            message: 'Срок действия токена истёк. Войдите снова.',
          },
        });
      }
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Недействительный токен',
        },
      });
    }
    
    // 4. Проверяем, существует ли пользователь (на случай удаления)
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Пользователь не найден',
        },
      });
    }
    
    // 5. Прикрепляем пользователя к объекту запроса
    // Теперь в контроллерах можно использовать req.user
    req.user = user;
    
    // 6. Передаём управление следующему middleware или контроллеру
    next();
  } catch (error) {
    next(error);
  }
};