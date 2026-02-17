import { Router } from 'express';

const router = Router();

// GET /api/surveys - Obtener todas las encuestas
router.get('/', (_req, res) => {
  res.json({ message: 'Listar encuestas' });
});

// GET /api/surveys/:id - Obtener una encuesta
router.get('/:id', (req, res) => {
  res.json({ message: `Obtener encuesta ${req.params.id}` });
});

// POST /api/surveys - Crear encuesta
router.post('/', (_req, res) => {
  res.json({ message: 'Crear encuesta' });
});

// PUT /api/surveys/:id - Actualizar encuesta
router.put('/:id', (req, res) => {
  res.json({ message: `Actualizar encuesta ${req.params.id}` });
});

// DELETE /api/surveys/:id - Eliminar encuesta
router.delete('/:id', (req, res) => {
  res.json({ message: `Eliminar encuesta ${req.params.id}` });
});

export default router;
