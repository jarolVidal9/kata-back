import { Router } from 'express';
import { SurveyController } from './survey.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();
const controller = new SurveyController();

// Ruta pública para ver y responder encuestas
router.get('/public/:id', controller.getPublicSurvey);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// CRUD básico de encuestas
router.get('/', controller.getMySurveys);           // Listar mis encuestas
router.get('/:id', controller.getSurveyById);       // Obtener una encuesta
router.post('/', controller.createSurvey);          // Crear encuesta
router.put('/:id', controller.updateSurvey);        // Actualizar encuesta (incluye cambio de estado)
router.delete('/:id', controller.deleteSurvey);     // Eliminar encuesta

export default router;
