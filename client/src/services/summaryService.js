// client/src/services/summaryService.js
import { get } from "./api.js";

/**
 * Получить общий баланс (доходы - расходы)
 * @returns {Promise<{totalIncome: number, totalExpense: number, balance: number}>}
 */
export const getBalance = async () => {
  try {
    const data = await get("/summary/balance");
    return data;
  } catch (error) {
    console.error("Ошибка загрузки баланса:", error);
    throw error;
  }
};

/**
 * Получить разбивку по категориям
 * @returns {Promise<{incomes: Array, expenses: Array}>}
 */
export const getByCategory = async () => {
  try {
    const data = await get("/summary/by-category");
    return data;
  } catch (error) {
    console.error("Ошибка загрузки статистики по категориям:", error);
    throw error;
  }
};

/**
 * Получить разбивку по месяцам
 * @returns {Promise<{incomes: Array, expenses: Array}>}
 */
export const getByMonth = async () => {
  try {
    const data = await get("/summary/by-month");
    return data;
  } catch (error) {
    console.error("Ошибка загрузки статистики по месяцам:", error);
    throw error;
  }
};

/**
 * Получить последние транзакции (доходы + расходы), отсортированные по дате
 * @param {number} limit - Количество последних транзакций (по умолчанию 10)
 * @returns {Promise<Array>} Массив транзакций с полем type ('income' | 'expense')
 */
export const getRecentTransactions = async (limit = 10) => {
  try {
    // Загружаем последние доходы и расходы параллельно
    const [incomes, expenses] = await Promise.all([
      get("/incomes", { limit }),
      get("/expenses", { limit }),
    ]);

    // Извлекаем массивы данных (бэкенд может вернуть { data: [...] } или просто [...])
    const incomeList = Array.isArray(incomes) ? incomes : incomes.data || [];
    const expenseList = Array.isArray(expenses)
      ? expenses
      : expenses.data || [];

    // Добавляем поле type и объединяем
    const allTransactions = [
      ...incomeList.map((item) => ({ ...item, type: "income" })),
      ...expenseList.map((item) => ({ ...item, type: "expense" })),
    ];

    // Сортируем по дате (новые сначала)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Возвращаем только нужное количество
    return allTransactions.slice(0, limit);
  } catch (error) {
    console.error("Ошибка загрузки последних транзакций:", error);
    return [];
  }
};

/**
 * Получить полную сводку для Dashboard (все три типа данных одним запросом)
 * @returns {Promise<{balance: object, byCategory: object, byMonth: object}>}
 */
export const getDashboardSummary = async () => {
  try {
    const [balance, byCategory, byMonth] = await Promise.all([
      getBalance(),
      getByCategory(),
      getByMonth(),
    ]);
    return { balance, byCategory, byMonth };
  } catch (error) {
    console.error("Ошибка загрузки сводки для Dashboard:", error);
    throw error;
  }
};
