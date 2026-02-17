import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Registro
router.post('/register', authController.register);

// POST /api/auth/login - Login
router.post('/login', authController.login);

export default router;
