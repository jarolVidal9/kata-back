import { Router } from 'express';
import { SurveyController } from './survey.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();
const controller = new SurveyController();

// Rutas públicas
router.get('/public/:id', controller.getPublicSurvey);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

router.get('/', controller.getMySurveys);
router.get('/:id', controller.getSurveyById);
router.post('/', controller.createSurvey);
router.put('/:id', controller.updateSurvey);
router.delete('/:id', controller.deleteSurvey);
router.patch('/:id/publish', controller.publishSurvey);
router.patch('/:id/close', controller.closeSurvey);
router.get('/:id/stats', controller.getSurveyStats);

export default router;
