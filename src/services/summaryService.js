// src/services/summaryService.js
import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';
import { getCategoryLabel } from '../utils/constants.js';

/**
 * Получить общий баланс (доходы минус расходы)
 * @returns {Object} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

/**
 * Получить данные по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' или 'expense')
 * @param {string} period - Период ('all', 'month', 'year') — пока не используется
 * @returns {Array} Массив объектов { name, value } для графика
 */
export const getByCategory = (type = 'expense', period = 'all') => {
  const items = type === 'income' ? getIncomes() : getExpenses();
  
  // Группировка по категориям
  const categoryMap = {};
  items.forEach((item) => {
    const categoryId = item.category || 'other';
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = 0;
    }
    categoryMap[categoryId] += item.amount || 0;
  });
  
  // Преобразование в формат для графика
  return Object.entries(categoryMap)
    .map(([categoryId, value]) => ({
      name: getCategoryLabel(categoryId, type),
      value,
    }))
    .sort((a, b) => b.value - a.value); // Сортировка по убыванию
};

/**
 * Получить месячную сводку для столбчатого графика
 * @param {number} year - Год (по умолчанию текущий)
 * @returns {Array} Массив объектов { month, income, expense } для графика
 */
export const getMonthlySummary = (year = new Date().getFullYear()) => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  // Названия месяцев
  const monthNames = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ];
  
  // Инициализация массива для всех месяцев года
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: monthNames[index],
    income: 0,
    expense: 0,
  }));
  
  // Подсчёт доходов по месяцам
  incomes.forEach((income) => {
    const date = new Date(income.date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].income += income.amount || 0;
    }
  });
  
  // Подсчёт расходов по месяцам
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].expense += expense.amount || 0;
    }
  });
  
  return monthlyData;
};

/**
 * Получить последние операции (доходы + расходы, отсортированные по дате)
 * @param {number} limit - Количество операций (по умолчанию 5)
 * @returns {Array} Массив последних операций
 */
export const getRecentTransactions = (limit = 5) => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  // Объединяем все операции
  const allTransactions = [
    ...incomes.map((i) => ({ ...i, categoryLabel: getCategoryLabel(i.category, 'income') })),
    ...expenses.map((e) => ({ ...e, categoryLabel: getCategoryLabel(e.category, 'expense') })),
  ];
  
  // Сортировка по дате (новые первые)
  allTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  return allTransactions.slice(0, limit);
};