// server/src/routes/auth.js
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/v1/auth/register - регистрация нового пользователя
router.post('/register', register);

// POST /api/v1/auth/login - вход пользователя
router.post('/login', login);

export default router;