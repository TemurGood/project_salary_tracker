// server/src/controllers/expenseController.js
import * as expenseService from '../services/expenseService.js';
import { validateExpense } from '../middleware/validate.js';

export const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      category: req.query.category,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      isRecurring: req.query.isRecurring !== undefined 
        ? req.query.isRecurring === 'true' 
        : undefined,
    };
    
    const expenses = await expenseService.getAllExpenses(userId, page, limit, filters);
    
    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const { id } = req.params;
    
    const expense = await expenseService.getExpenseById(userId, id);
    
    if (!expense) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const create = [
  validateExpense,
  async (req, res, next) => {
    try {
      const userId = req.user.id; // 🔥
      const { amount, date, category, comment, isRecurring } = req.body;
      
      const newExpense = await expenseService.createExpense(userId, {
        amount,
        date,
        category,
        comment,
        isRecurring,
      });
      
      res.status(201).json({
        success: true,
        data: newExpense,
        message: 'Расход успешно создан',
      });
    } catch (error) {
      next(error);
    }
  },
];

export const update = [
  validateExpense,
  async (req, res, next) => {
    try {
      const userId = req.user.id; // 🔥
      const { id } = req.params;
      const { amount, date, category, comment, isRecurring } = req.body;
      
      const updatedExpense = await expenseService.updateExpense(userId, id, {
        amount,
        date,
        category,
        comment,
        isRecurring,
      });
      
      if (!updatedExpense) {
        const error = new Error('Расход не найден');
        error.statusCode = 404;
        throw error;
      }
      
      res.status(200).json({
        success: true,
        data: updatedExpense,
        message: 'Расход успешно обновлён',
      });
    } catch (error) {
      next(error);
    }
  },
];

export const remove = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const { id } = req.params;
    
    const deleted = await expenseService.deleteExpense(userId, id);
    
    if (!deleted) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      message: 'Расход успешно удалён',
    });
  } catch (error) {
    next(error);
  }
};