// src/utils/formatters.js

/**
 * Форматирование даты в локальный формат (ДД.ММ.ГГГГ)
 * @param {string|Date} date - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '—';
    }
    return dateObj.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирование даты с названием месяца (ДД месяц ГГГГ)
 * @param {string|Date} date - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
 */
export const formatDateLong = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '—';
    }
    return dateObj.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирование даты для графиков (МММ ГГ)
 * @param {string|Date} date - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
 */
export const formatDateForChart = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '—';
    }
    return dateObj.toLocaleDateString('ru-RU', {
      month: 'short',
      year: '2-digit',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирование суммы в рублях
 * @param {number} amount - Сумма
 * @param {boolean} showSign - Показывать ли знак (+/-)
 * @param {string} type - Тип операции ('income' или 'expense')
 * @returns {string} Отформатированная сумма
 */
export const formatAmount = (amount, showSign = false, type = null) => {
  const value = amount ?? 0;
  const formatted = value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (showSign && type) {
    const sign = type === 'income' ? '+' : '−';
    return `${sign}${formatted} ₽`;
  }

  return `${formatted} ₽`;
};

/**
 * Форматирование суммы для графиков (сокращённый формат: 10k, 1M)
 * @param {number} amount - Сумма
 * @returns {string} Отформатированная сумма
 */
export const formatAmountShort = (amount) => {
  const value = amount ?? 0;
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ₽`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ₽`;
  }
  return `${value} ₽`;
};

/**
 * Получение текущей даты в формате ISO (YYYY-MM-DD)
 * @returns {string} Текущая дата
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};