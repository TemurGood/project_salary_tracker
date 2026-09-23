// src/services/expenseService.js
import { storageGet, storageSet, generateUUID, STORAGE_KEYS } from './storage.js';

/**
 * Получить все расходы
 * @returns {Array} Массив расходов
 */
export const getExpenses = () => {
  return storageGet(STORAGE_KEYS.EXPENSES, []);
};

/**
 * Получить расход по ID
 * @param {string} id - ID расхода
 * @returns {Object|null} Расход или null, если не найден
 */
export const getExpenseById = (id) => {
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id) || null;
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - Данные расхода (category, amount, date, comment)
 * @returns {Object} Созданный расход с добавленным id и type
 */
export const addExpense = (expenseData) => {
  const expenses = getExpenses();
  
  const newExpense = {
    id: generateUUID(),
    type: 'expense',
    category: expenseData.category,
    amount: parseFloat(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    comment: expenseData.comment || '',
    createdAt: new Date().toISOString(),
  };
  
  expenses.push(newExpense);
  storageSet(STORAGE_KEYS.EXPENSES, expenses);
  
  return newExpense;
};

/**
 * Обновить существующий расход
 * @param {string} id - ID расхода
 * @param {Object} expenseData - Новые данные расхода
 * @returns {Object|null} Обновлённый расход или null, если не найден
 */
export const updateExpense = (id, expenseData) => {
  const expenses = getExpenses();
  const index = expenses.findIndex((expense) => expense.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedExpense = {
    ...expenses[index],
    category: expenseData.category ?? expenses[index].category,
    amount: parseFloat(expenseData.amount) ?? expenses[index].amount,
    date: expenseData.date ?? expenses[index].date,
    comment: expenseData.comment ?? expenses[index].comment,
    updatedAt: new Date().toISOString(),
  };
  
  expenses[index] = updatedExpense;
  storageSet(STORAGE_KEYS.EXPENSES, expenses);
  
  return updatedExpense;
};

/**
 * Удалить расход
 * @param {string} id - ID расхода
 * @returns {boolean} true, если удалён; false, если не найден
 */
export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);
  
  if (filteredExpenses.length === expenses.length) {
    return false; // Ничего не изменилось — расход не найден
  }
  
  storageSet(STORAGE_KEYS.EXPENSES, filteredExpenses);
  return true;
};