// server/src/routes/expenses.js
import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
// 🔥 ДОБАВЬ ЭТУ СТРОКУ:
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔥 ДОБАВЬ authenticateToken перед каждым контроллером:
router.get('/', authenticateToken, expenseController.getAll);
router.get('/:id', authenticateToken, expenseController.getById);
router.post('/', authenticateToken, expenseController.create);
router.put('/:id', authenticateToken, expenseController.update);
router.delete('/:id', authenticateToken, expenseController.remove);

export default router;