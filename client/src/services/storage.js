// src/services/storage.js

/**
 * Безопасное чтение данных из localStorage
 * @param {string} key - Ключ
 * @param {*} defaultValue - Значение по умолчанию, если ключ не найден или ошибка
 * @returns {*} Распарсенные данные или defaultValue
 */
export const storageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Безопасная запись данных в localStorage
 * @param {string} key - Ключ
 * @param {*} value - Значение (будет сериализовано в JSON)
 * @returns {boolean} Успешно ли сохранено
 */
export const storageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка записи в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - Ключ
 * @returns {boolean} Успешно ли удалено
 */
export const storageRemove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Очистка всего localStorage
 * @returns {boolean} Успешно ли очищено
 */
export const storageClear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка очистки localStorage:', error);
    return false;
  }
};

/**
 * Генерация уникального идентификатора (UUID)
 * Использует crypto.randomUUID(), если доступен, иначе fallback
 * @returns {string} UUID
 */
export const generateUUID = () => {
  // Современный метод (поддерживается во всех актуальных браузерах)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback для старых браузеров
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Ключи для localStorage
export const STORAGE_KEYS = {
  INCOMES: 'incomes',
  EXPENSES: 'expenses',
};