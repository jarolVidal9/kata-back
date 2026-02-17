import { Router } from 'express';

const router = Router();

// GET /api/questions - Obtener todas las preguntas
router.get('/', (_req, res) => {
  res.json({ message: 'Listar preguntas' });
});

// POST /api/questions - Crear pregunta
router.post('/', (_req, res) => {
  res.json({ message: 'Crear pregunta' });
});

export default router;
