import { Router } from 'express';

const router = Router();

// GET /api/responses - Obtener todas las respuestas
router.get('/', (_req, res) => {
  res.json({ message: 'Listar respuestas' });
});

// POST /api/responses - Enviar respuesta
router.post('/', (_req, res) => {
  res.json({ message: 'Crear respuesta' });
});

export default router;
