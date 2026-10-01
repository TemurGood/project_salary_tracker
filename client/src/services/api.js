// client/src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// 🔥 Функции для работы с токеном
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

/**
 * Универсальная функция для выполнения HTTP-запросов
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  
  // 🔥 Получаем токен из localStorage
  const token = getToken();
  
  // Стандартные заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 🔥 Если токен есть — добавляем его в заголовок Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    // 🔥 Обработка ошибок авторизации
    if (response.status === 401 || response.status === 403) {
      // Токен недействителен или истёк — удаляем его
      removeToken();
      
      // Перенаправляем на страницу входа (если она есть)
      // window.location.href = '/login';
      
      throw new Error('Сессия истекла. Войдите снова.');
    }
    
    // Если сервер вернул ошибку
    if (!response.ok) {
      const errorMessage = data.error?.message || 'Ошибка сервера';
      const errorCode = data.error?.code || response.status;
      throw new Error(`${errorMessage} (код: ${errorCode})`);
    }
    
    // Успешный ответ
    return data.data !== undefined ? data.data : data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.');
    }
    throw error;
  }
};

// ================= Экспортируемые методы =================

export const get = (path, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;
  return request(fullPath, { method: 'GET' });
};

export const post = (path, body) => {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const put = (path, body) => {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const del = (path) => {
  return request(path, { method: 'DELETE' });
};

// 🔥 Экспортируем функции для работы с токеном (нужны для страниц регистрации/входа)
export { getToken, setToken, removeToken };