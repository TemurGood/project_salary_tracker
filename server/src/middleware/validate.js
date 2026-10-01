// server/src/middleware/validate.js
import { INCOME_CATEGORY_IDS, EXPENSE_CATEGORY_IDS } from '../utils/categories.js';

// Проверка формата даты YYYY-MM-DD
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Валидация для доходов
export const validateIncome = (req, res, next) => {
  const { amount, date, category, comment } = req.body;
  
  // Проверка amount
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Сумма должна быть положительным числом',
      },
    });
  }
  
  // Проверка date
  if (!date || !isValidDate(date)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Дата должна быть в формате YYYY-MM-DD',
      },
    });
  }
  
  // Проверка category
  if (!category || !INCOME_CATEGORY_IDS.includes(category)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Недопустимая категория дохода',
      },
    });
  }
  
  // Проверка comment (необязательное поле)
  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Комментарий должен быть строкой',
      },
    });
  }
  
  next();
};

// Валидация для расходов
export const validateExpense = (req, res, next) => {
  const { amount, date, category, comment, is_recurring } = req.body;
  
  // Проверка amount
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Сумма должна быть положительным числом',
      },
    });
  }
  
  // Проверка date
  if (!date || !isValidDate(date)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Дата должна быть в формате YYYY-MM-DD',
      },
    });
  }
  
  // Проверка category
  if (!category || !EXPENSE_CATEGORY_IDS.includes(category)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Недопустимая категория расхода',
      },
    });
  }
  
  // Проверка comment (необязательное поле)
  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Комментарий должен быть строкой',
      },
    });
  }
  
  // Проверка is_recurring (необязательное поле, по умолчанию 0)
  if (is_recurring !== undefined && typeof is_recurring !== 'boolean') {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'is_recurring должен быть булевым значением',
      },
    });
  }
  
  next();
};