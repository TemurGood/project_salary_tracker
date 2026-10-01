// server/src/routes/incomes.js
import express from 'express';
import * as incomeController from '../controllers/incomeController.js';
// 🔥 ДОБАВЬ ЭТУ СТРОКУ:
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔥 ДОБАВЬ authenticateToken перед каждым контроллером:
// GET /api/v1/incomes - получить все доходы (с пагинацией и фильтрами)
router.get('/', authenticateToken, incomeController.getAll);

// GET /api/v1/incomes/:id - получить доход по ID
router.get('/:id', authenticateToken, incomeController.getById);

// POST /api/v1/incomes - создать новый доход
router.post('/', authenticateToken, incomeController.create);

// PUT /api/v1/incomes/:id - обновить доход
router.put('/:id', authenticateToken, incomeController.update);

// DELETE /api/v1/incomes/:id - удалить доход
router.delete('/:id', authenticateToken, incomeController.remove);

export default router;