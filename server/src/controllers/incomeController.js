// server/src/controllers/incomeController.js
import * as incomeService from '../services/incomeService.js';
import { validateIncome } from '../middleware/validate.js';

// Получить все доходы (с пагинацией и фильтрами)
export const getAll = async (req, res, next) => {
  try {
    // 🔥 Извлекаем userId из req.user (прикреплён middleware authenticateToken)
    const userId = req.user.id;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      category: req.query.category,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    };
    
    // 🔥 Передаём userId в сервис
    const incomes = await incomeService.getAllIncomes(userId, page, limit, filters);
    
    res.status(200).json({
      success: true,
      data: incomes,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Получить доход по ID
export const getById = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const { id } = req.params;
    
    const income = await incomeService.getIncomeById(userId, id);
    
    if (!income) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// Создать новый доход
export const create = [
  validateIncome,
  async (req, res, next) => {
    try {
      const userId = req.user.id; // 🔥
      const { amount, date, category, comment } = req.body;
      
      // 🔥 Передаём userId в сервис
      const newIncome = await incomeService.createIncome(userId, {
        amount,
        date,
        category,
        comment,
      });
      
      res.status(201).json({
        success: true,
        data: newIncome,
        message: 'Доход успешно создан',
      });
    } catch (error) {
      next(error);
    }
  },
];

// Обновить доход
export const update = [
  validateIncome,
  async (req, res, next) => {
    try {
      const userId = req.user.id; // 🔥
      const { id } = req.params;
      const { amount, date, category, comment } = req.body;
      
      const updatedIncome = await incomeService.updateIncome(userId, id, {
        amount,
        date,
        category,
        comment,
      });
      
      if (!updatedIncome) {
        const error = new Error('Доход не найден');
        error.statusCode = 404;
        throw error;
      }
      
      res.status(200).json({
        success: true,
        data: updatedIncome,
        message: 'Доход успешно обновлён',
      });
    } catch (error) {
      next(error);
    }
  },
];

// Удалить доход
export const remove = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const { id } = req.params;
    
    const deleted = await incomeService.deleteIncome(userId, id);
    
    if (!deleted) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      message: 'Доход успешно удалён',
    });
  } catch (error) {
    next(error);
  }
};