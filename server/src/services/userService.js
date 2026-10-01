// server/src/services/userService.js
import db from '../db/connection.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Количество раундов шифрования (чем больше, тем безопаснее, но медленнее)
const SALT_ROUNDS = 10;

/**
 * Создать нового пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль в открытом виде
 * @param {string} name - Имя (опционально)
 * @returns {Promise<object>} Созданный пользователь (без пароля)
 */
export const createUser = async (email, password, name = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Шифруем пароль
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      
      // 2. Генерируем уникальный ID
      const id = crypto.randomUUID();
      
      // 3. SQL-запрос для вставки
      const query = `
        INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `;
      
      // 4. Выполняем запрос
      db.run(query, [id, email, passwordHash, name], function (err) {
        if (err) {
          // Если email уже существует, SQLite вернёт ошибку UNIQUE constraint
          if (err.message.includes('UNIQUE constraint failed')) {
            reject(new Error('Пользователь с таким email уже существует'));
          } else {
            reject(err);
          }
        } else {
          // 5. Возвращаем пользователя БЕЗ пароля (безопасность!)
          resolve({
            id,
            email,
            name,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Найти пользователя по email
 * @param {string} email - Email для поиска
 * @returns {Promise<object|null>} Пользователь (включая password_hash) или null
 */
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
};

/**
 * Проверить пароль пользователя
 * @param {string} plainPassword - Пароль в открытом виде (от пользователя)
 * @param {string} hashedPassword - Хэш из базы данных
 * @returns {Promise<boolean>} true если пароль верный, false если нет
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Найти пользователя по ID
 * @param {string} id - UUID пользователя
 * @returns {Promise<object|null>} Пользователь (без пароля) или null
 */
export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, email, name, created_at FROM users WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
};