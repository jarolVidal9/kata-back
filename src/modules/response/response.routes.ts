import { Router } from 'express';
import { ResponseController } from './response.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();
const controller = new ResponseController();

// Ruta pública para enviar respuestas
router.post('/submit', controller.submitResponse);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

router.get('/survey/:surveyId', controller.getResponsesBySurvey);
router.get('/:id', controller.getResponseById);
router.delete('/:id', controller.deleteResponse);
router.get('/survey/:surveyId/analytics', controller.getSurveyAnalytics);

export default router;
