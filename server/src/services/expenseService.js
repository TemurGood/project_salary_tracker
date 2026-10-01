// server/src/services/expenseService.js
import db from '../db/connection.js';
import crypto from 'crypto';

// Преобразование snake_case из БД в camelCase для JSON
const mapExpense = (row) => ({
  id: row.id,
  amount: row.amount,
  date: row.date,
  category: row.category,
  comment: row.comment || '',
  isRecurring: Boolean(row.is_recurring),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Получить все расходы пользователя с пагинацией и фильтрами
 * @param {string} userId - ID текущего пользователя
 * @param {number} page - Номер страницы
 * @param {number} limit - Количество записей на странице
 * @param {object} filters - Фильтры (category, dateFrom, dateTo, isRecurring)
 */
export const getAllExpenses = (userId, page = 1, limit = 10, filters = {}) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    // Базовый запрос — 🔥 ДОБАВЛЕН user_id
    let query = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [userId]; // 🔥 Добавляем userId в параметры
    
    const conditions = [];
    
    // Фильтр по категории
    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }
    
    // Фильтр по дате (от)
    if (filters.dateFrom) {
      conditions.push('date >= ?');
      params.push(filters.dateFrom);
    }
    
    // Фильтр по дате (до)
    if (filters.dateTo) {
      conditions.push('date <= ?');
      params.push(filters.dateTo);
    }
    
    // Фильтр по признаку регулярности
    if (filters.isRecurring !== undefined) {
      conditions.push('is_recurring = ?');
      params.push(filters.isRecurring ? 1 : 0);
    }
    
    // Добавляем условия в запрос
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }
    
    // Сортировка по дате (новые сначала)
    query += ' ORDER BY date DESC, created_at DESC';
    
    // Пагинация
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(mapExpense));
      }
    });
  });
};

/**
 * Получить расход по ID (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID расхода
 */
export const getExpenseById = (userId, id) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА проверка user_id
    db.get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? mapExpense(row) : null);
      }
    });
  });
};

/**
 * Создать новый расход
 * @param {string} userId - ID текущего пользователя
 * @param {object} data - Данные расхода
 */
export const createExpense = (userId, data) => {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const { amount, date, category, comment = '', isRecurring = false } = data;
    
    // 🔥 ДОБАВЛЕН user_id в запрос
    const query = `
      INSERT INTO expenses (id, user_id, amount, date, category, comment, is_recurring, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    
    db.run(query, [id, userId, amount, date, category, comment, isRecurring ? 1 : 0], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, amount, date, category, comment, isRecurring });
      }
    });
  });
};

/**
 * Обновить расход (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID расхода
 * @param {object} data - Новые данные
 */
export const updateExpense = (userId, id, data) => {
  return new Promise((resolve, reject) => {
    const { amount, date, category, comment, isRecurring } = data;
    
    // 🔥 ДОБАВЛЕНА проверка user_id
    const query = `
      UPDATE expenses
      SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `;
    
    db.run(query, [amount, date, category, comment, isRecurring ? 1 : 0, id, userId], function (err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes === 0) {
          resolve(null); // Запись не найдена или не принадлежит пользователю
        } else {
          resolve({ id, amount, date, category, comment, isRecurring });
        }
      }
    });
  });
};

/**
 * Удалить расход (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID расхода
 */
export const deleteExpense = (userId, id) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА проверка user_id
    db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0); // true если удалено, false если не найдено
      }
    });
  });
};