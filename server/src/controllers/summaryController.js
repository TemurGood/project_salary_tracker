// server/src/controllers/summaryController.js
import * as summaryService from '../services/summaryService.js';

export const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const balance = await summaryService.getBalance(userId);
    
    res.status(200).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

export const getByCategory = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const stats = await summaryService.getByCategory(userId);
    
    res.status(200).json({
      success: true,
      data: stats.byCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getByMonth = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥
    const stats = await summaryService.getByMonth(userId);
    
    res.status(200).json({
      success: true,
      data: stats.byMonth,
    });
  } catch (error) {
    next(error);
  }
};