// server/src/controllers/authController.js
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, comparePassword } from '../services/userService.js';
import { config } from '../config/index.js';

/**
 * Регистрация нового пользователя
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // 1. Простая валидация входных данных
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Email и пароль обязательны',
        },
      });
    }
    
    // 2. Создаём пользователя (пароль будет зашифрован внутри createUser)
    const user = await createUser(email, password, name || '');
    
    // 3. Создаём JWT-токен
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Данные внутри токена
      config.jwtSecret,                        // Секретный ключ
      { expiresIn: config.jwtExpiresIn }       // Срок жизни
    );
    
    // 4. Возвращаем токен и данные пользователя
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      message: 'Регистрация успешна',
    });
  } catch (error) {
    // Если email уже занят
    if (error.message.includes('уже существует')) {
      return res.status(409).json({
        error: {
          code: 409,
          message: error.message,
        },
      });
    }
    next(error);
  }
};

/**
 * Вход пользователя
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 1. Простая валидация
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Email и пароль обязательны',
        },
      });
    }
    
    // 2. Ищем пользователя по email
    const user = await findUserByEmail(email);
    
    if (!user) {
      // Не говорим "пользователь не найден" (безопасность)
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Неверный email или пароль',
        },
      });
    }
    
    // 3. Проверяем пароль
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Неверный email или пароль',
        },
      });
    }
    
    // 4. Создаём JWT-токен
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // 5. Возвращаем токен и данные пользователя (БЕЗ password_hash!)
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      message: 'Вход выполнен успешно',
    });
  } catch (error) {
    next(error);
  }
};