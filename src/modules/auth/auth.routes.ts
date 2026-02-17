import { Router } from 'express';

const router = Router();

// POST /api/auth/register - Registro
router.post('/register', (_req, res) => {
  res.json({ message: 'Registro de usuario' });
});

// POST /api/auth/login - Login
router.post('/login', (_req, res) => {
  res.json({ message: 'Login de usuario' });
});

export default router;
