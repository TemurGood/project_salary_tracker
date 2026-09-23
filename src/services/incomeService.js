// src/services/incomeService.js
import { storageGet, storageSet, generateUUID, STORAGE_KEYS } from './storage.js';

/**
 * Получить все доходы
 * @returns {Array} Массив доходов
 */
export const getIncomes = () => {
  return storageGet(STORAGE_KEYS.INCOMES, []);
};

/**
 * Получить доход по ID
 * @param {string} id - ID дохода
 * @returns {Object|null} Доход или null, если не найден
 */
export const getIncomeById = (id) => {
  const incomes = getIncomes();
  return incomes.find((income) => income.id === id) || null;
};

/**
 * Добавить новый доход
 * @param {Object} incomeData - Данные дохода (category, amount, date, comment)
 * @returns {Object} Созданный доход с добавленным id и type
 */
export const addIncome = (incomeData) => {
  const incomes = getIncomes();
  
  const newIncome = {
    id: generateUUID(),
    type: 'income',
    category: incomeData.category,
    amount: parseFloat(incomeData.amount) || 0,
    date: incomeData.date || new Date().toISOString().split('T')[0],
    comment: incomeData.comment || '',
    createdAt: new Date().toISOString(),
  };
  
  incomes.push(newIncome);
  storageSet(STORAGE_KEYS.INCOMES, incomes);
  
  return newIncome;
};

/**
 * Обновить существующий доход
 * @param {string} id - ID дохода
 * @param {Object} incomeData - Новые данные дохода
 * @returns {Object|null} Обновлённый доход или null, если не найден
 */
export const updateIncome = (id, incomeData) => {
  const incomes = getIncomes();
  const index = incomes.findIndex((income) => income.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedIncome = {
    ...incomes[index],
    category: incomeData.category ?? incomes[index].category,
    amount: parseFloat(incomeData.amount) ?? incomes[index].amount,
    date: incomeData.date ?? incomes[index].date,
    comment: incomeData.comment ?? incomes[index].comment,
    updatedAt: new Date().toISOString(),
  };
  
  incomes[index] = updatedIncome;
  storageSet(STORAGE_KEYS.INCOMES, incomes);
  
  return updatedIncome;
};

/**
 * Удалить доход
 * @param {string} id - ID дохода
 * @returns {boolean} true, если удалён; false, если не найден
 */
export const deleteIncome = (id) => {
  const incomes = getIncomes();
  const filteredIncomes = incomes.filter((income) => income.id !== id);
  
  if (filteredIncomes.length === incomes.length) {
    return false; // Ничего не изменилось — доход не найден
  }
  
  storageSet(STORAGE_KEYS.INCOMES, filteredIncomes);
  return true;
};