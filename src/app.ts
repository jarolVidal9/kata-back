import express, { Application, Request, Response } from 'express';
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

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'API Kata Encuestas - Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      surveys: '/api/surveys',
      questions: '/api/questions',
      responses: '/api/responses'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/responses', responseRoutes);

// Error handler (debe ir al final)
app.use(errorHandler);

export default app;
