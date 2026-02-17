import express, { Application} from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middlewares/errorHandler';

// Import module routes
import authRoutes from './modules/auth/auth.routes';
import surveyRoutes from './modules/survey/survey.routes';
import questionRoutes from './modules/question/question.routes';
import responseRoutes from './modules/response/response.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(` ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/responses', responseRoutes);

// Error handler (debe ir al final)
app.use(errorHandler);

export default app;
