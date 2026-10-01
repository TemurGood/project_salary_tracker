// client/src/services/expenseService.js
import { get, post, put, del } from "./api.js";

/**
 * Получить список расходов с фильтрами и пагинацией
 * @param {object} filters - Фильтры (category, dateFrom, dateTo, isRecurring, page, limit)
 * @returns {Promise<{data: Array, pagination: object}>} Список расходов и информация о пагинации
 */
export const getExpenses = async (filters = {}) => {
  try {
    const data = await get("/expenses", filters);
    return data;
  } catch (error) {
    console.error("Ошибка загрузки расходов:", error);
    throw error;
  }
};

/**
 * Получить расход по ID
 * @param {string} id - UUID расхода
 * @returns {Promise<object>} Данные расхода
 */
export const getExpenseById = async (id) => {
  try {
    const data = await get(`/expenses/${id}`);
    return data;
  } catch (error) {
    console.error(`Ошибка загрузки расхода ${id}:`, error);
    throw error;
  }
};

/**
 * Создать новый расход
 * @param {object} expenseData - Данные расхода (amount, date, category, comment, isRecurring)
 * @returns {Promise<object>} Созданный расход
 */
export const addExpense = async (expenseData) => {
  try {
    const data = await post("/expenses", expenseData);
    return data;
  } catch (error) {
    console.error("Ошибка добавления расхода:", error);
    throw error;
  }
};

/**
 * Обновить существующий расход
 * @param {string} id - UUID расхода
 * @param {object} data - Новые данные (amount, date, category, comment, isRecurring)
 * @returns {Promise<object>} Обновлённый расход
 */
export const updateExpense = async (id, data) => {
  try {
    const updated = await put(`/expenses/${id}`, data);
    return updated;
  } catch (error) {
    console.error(`Ошибка обновления расхода ${id}:`, error);
    throw error;
  }
};

/**
 * Удалить расход
 * @param {string} id - UUID расхода
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  try {
    await del(`/expenses/${id}`);
  } catch (error) {
    console.error(`Ошибка удаления расхода ${id}:`, error);
    throw error;
  }
};
