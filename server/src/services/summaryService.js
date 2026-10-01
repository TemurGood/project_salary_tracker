// server/src/services/summaryService.js
import db from '../db/connection.js';

/**
 * Получить общий баланс пользователя (доходы - расходы)
 * @param {string} userId - ID текущего пользователя
 */
export const getBalance = (userId) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА фильтрация по user_id в обоих подзапросах
    const query = `
      SELECT
        COALESCE((SELECT SUM(amount) FROM incomes WHERE user_id = ?), 0) AS totalIncome,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE user_id = ?), 0) AS totalExpense
    `;
    
    db.get(query, [userId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          totalIncome: row.totalIncome,
          totalExpense: row.totalExpense,
          balance: row.totalIncome - row.totalExpense,
        });
      }
    });
  });
};

/**
 * Получить разбивку по категориям для пользователя
 * @param {string} userId - ID текущего пользователя
 */
export const getByCategory = (userId) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА фильтрация по user_id
    const incomeQuery = `
      SELECT category, SUM(amount) AS total, COUNT(*) AS count
      FROM incomes
      WHERE user_id = ?
      GROUP BY category
      ORDER BY total DESC
    `;
    
    const expenseQuery = `
      SELECT category, SUM(amount) AS total, COUNT(*) AS count
      FROM expenses
      WHERE user_id = ?
      GROUP BY category
      ORDER BY total DESC
    `;
    
    db.all(incomeQuery, [userId], (err, incomeRows) => {
      if (err) {
        reject(err);
        return;
      }
      
      db.all(expenseQuery, [userId], (err, expenseRows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            byCategory: {
              incomes: incomeRows,
              expenses: expenseRows,
            },
          });
        }
      });
    });
  });
};

/**
 * Получить разбивку по месяцам для пользователя
 * @param {string} userId - ID текущего пользователя
 */
export const getByMonth = (userId) => {
  return new Promise((resolve, reject) => {
    // 🔥 ДОБАВЛЕНА фильтрация по user_id
    const incomeQuery = `
      SELECT
        strftime('%Y-%m', date) AS month,
        SUM(amount) AS total,
        COUNT(*) AS count
      FROM incomes
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
    `;
    
    const expenseQuery = `
      SELECT
        strftime('%Y-%m', date) AS month,
        SUM(amount) AS total,
        COUNT(*) AS count
      FROM expenses
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
    `;
    
    db.all(incomeQuery, [userId], (err, incomeRows) => {
      if (err) {
        reject(err);
        return;
      }
      
      db.all(expenseQuery, [userId], (err, expenseRows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            byMonth: {
              incomes: incomeRows,
              expenses: expenseRows,
            },
          });
        }
      });
    });
  });
};