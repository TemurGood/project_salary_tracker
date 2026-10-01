// client/src/services/incomeService.js
import { get, post, put, del } from "./api.js";

/**
 * Получить список доходов с фильтрами и пагинацией
 * @param {object} filters - Фильтры (category, dateFrom, dateTo, page, limit)
 * @returns {Promise<{data: Array, pagination: object}>} Список доходов и информация о пагинации
 */
export const getIncomes = async (filters = {}) => {
  try {
    const data = await get("/incomes", filters);
    // Бэкенд возвращает { data: [...], pagination: {...} }
    // Мы возвращаем весь объект, чтобы компонент мог использовать pagination
    return data;
  } catch (error) {
    console.error("Ошибка загрузки доходов:", error);
    throw error;
  }
};

/**
 * Получить доход по ID
 * @param {string} id - UUID дохода
 * @returns {Promise<object>} Данные дохода
 */
export const getIncomeById = async (id) => {
  try {
    const data = await get(`/incomes/${id}`);
    return data;
  } catch (error) {
    console.error(`Ошибка загрузки дохода ${id}:`, error);
    throw error;
  }
};

/**
 * Создать новый доход
 * @param {object} incomeData - Данные дохода (amount, date, category, comment)
 * @returns {Promise<object>} Созданный доход
 */
export const addIncome = async (incomeData) => {
  try {
    const data = await post("/incomes", incomeData);
    return data;
  } catch (error) {
    console.error("Ошибка добавления дохода:", error);
    throw error;
  }
};

/**
 * Обновить существующий доход
 * @param {string} id - UUID дохода
 * @param {object} data - Новые данные (amount, date, category, comment)
 * @returns {Promise<object>} Обновлённый доход
 */
export const updateIncome = async (id, data) => {
  try {
    const updated = await put(`/incomes/${id}`, data);
    return updated;
  } catch (error) {
    console.error(`Ошибка обновления дохода ${id}:`, error);
    throw error;
  }
};

/**
 * Удалить доход
 * @param {string} id - UUID дохода
 * @returns {Promise<void>}
 */
export const deleteIncome = async (id) => {
  try {
    await del(`/incomes/${id}`);
  } catch (error) {
    console.error(`Ошибка удаления дохода ${id}:`, error);
    throw error;
  }
};
