// server/src/services/incomeService.js
import db from '../db/connection.js';
import crypto from 'crypto';

// Преобразование snake_case из БД в camelCase для JSON
const mapIncome = (row) => ({
  id: row.id,
  amount: row.amount,
  date: row.date,
  category: row.category,
  comment: row.comment || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Получить все доходы пользователя с пагинацией и фильтрами
 * @param {string} userId - ID текущего пользователя
 * @param {number} page - Номер страницы
 * @param {number} limit - Количество записей на странице
 * @param {object} filters - Фильтры (category, dateFrom, dateTo)
 */
export const getAllIncomes = (userId, page = 1, limit = 10, filters = {}) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    // Базовый запрос — 🔥 ДОБАВЛЕН user_id
    let query = 'SELECT * FROM incomes WHERE user_id = ?';
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
        resolve(rows.map(mapIncome));
      }
    });
  });
};

/**
 * Получить доход по ID (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID дохода
 */
export const getIncomeById = (userId, id) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА проверка user_id
    db.get('SELECT * FROM incomes WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? mapIncome(row) : null);
      }
    });
  });
};

/**
 * Создать новый доход
 * @param {string} userId - ID текущего пользователя
 * @param {object} data - Данные дохода
 */
export const createIncome = (userId, data) => {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const { amount, date, category, comment = '' } = data;
    
    // 🔥 ДОБАВЛЕН user_id в запрос
    const query = `
      INSERT INTO incomes (id, user_id, amount, date, category, comment, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    
    db.run(query, [id, userId, amount, date, category, comment], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, amount, date, category, comment });
      }
    });
  });
};

/**
 * Обновить доход (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID дохода
 * @param {object} data - Новые данные
 */
export const updateIncome = (userId, id, data) => {
  return new Promise((resolve, reject) => {
    const { amount, date, category, comment } = data;
    
    // 🔥 ДОБАВЛЕНА проверка user_id
    const query = `
      UPDATE incomes
      SET amount = ?, date = ?, category = ?, comment = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `;
    
    db.run(query, [amount, date, category, comment, id, userId], function (err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes === 0) {
          resolve(null); // Запись не найдена или не принадлежит пользователю
        } else {
          resolve({ id, amount, date, category, comment });
        }
      }
    });
  });
};

/**
 * Удалить доход (только если он принадлежит пользователю)
 * @param {string} userId - ID текущего пользователя
 * @param {string} id - UUID дохода
 */
export const deleteIncome = (userId, id) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА проверка user_id
    db.run('DELETE FROM incomes WHERE id = ? AND user_id = ?', [id, userId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0); // true если удалено, false если не найдено
      }
    });
  });
};