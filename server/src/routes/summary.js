// server/src/routes/summary.js
import express from 'express';
import * as summaryController from '../controllers/summaryController.js';
// 🔥 ДОБАВЬ ЭТУ СТРОКУ:
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔥 ДОБАВЬ authenticateToken перед каждым контроллером:
router.get('/balance', authenticateToken, summaryController.getBalance);
router.get('/by-category', authenticateToken, summaryController.getByCategory);
router.get('/by-month', authenticateToken, summaryController.getByMonth);

export default router;