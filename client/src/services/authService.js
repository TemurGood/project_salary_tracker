// client/src/services/authService.js
import { post, getToken, setToken, removeToken } from './api.js';

// Ключ для хранения данных пользователя в localStorage
const USER_KEY = 'user';

/**
 * Регистрация нового пользователя
 * @param {string} email - Email
 * @param {string} password - Пароль
 * @param {string} name - Имя (опционально)
 * @returns {Promise<{user: object, token: string}>}
 */
export const register = async (email, password, name = '') => {
  try {
    const data = await post('/auth/register', { email, password, name });
    
    // Сохраняем токен и данные пользователя
    setToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

/**
 * Вход пользователя
 * @param {string} email - Email
 * @param {string} password - Пароль
 * @returns {Promise<{user: object, token: string}>}
 */
export const login = async (email, password) => {
  try {
    const data = await post('/auth/login', { email, password });
    
    // Сохраняем токен и данные пользователя
    setToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
};

/**
 * Выход пользователя
 */
export const logout = () => {
  removeToken();
  localStorage.removeItem(USER_KEY);
};

/**
 * Получить текущего пользователя
 * @returns {object|null} Данные пользователя или null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Проверить, авторизован ли пользователь
 * @returns {boolean} true если есть токен и данные пользователя
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return Boolean(token && user);
};