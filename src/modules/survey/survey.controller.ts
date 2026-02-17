import { Request, Response, NextFunction } from 'express';
import { SurveyService } from './survey.service';
import { log } from 'node:console';

export class SurveyController {
  private service = new SurveyService();

  getMySurveys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('=== SurveyController.getMySurveys ===');
      console.log('User ID:', req.user!.id);
      const userId = req.user!.id;
      const surveys = await this.service.getMySurveys(userId);
      console.log('Surveys encontradas:', surveys.length);
      res.json(surveys);
    } catch (error) {
      console.error('Error en getMySurveys:', error);
      next(error);
    }
  };

  getSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      const survey = await this.service.getSurveyById(id, userId);
      res.json(survey);
    } catch (error) {
      next(error);
    }
  };

  getPublicSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const survey = await this.service.getPublicSurvey(id);
      res.json(survey);
    } catch (error) {
      next(error);
    }
  };

  createSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      log('Creando encuesta para usuario ID:', req.user);
      const survey = await this.service.createSurvey(req.body, userId);
      res.status(201).json(survey);
    } catch (error) {
      next(error);
    }
  };

  updateSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      const survey = await this.service.updateSurvey(id, req.body, userId);
      res.json(survey);
    } catch (error) {
      next(error);
    }
  };

  deleteSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      await this.service.deleteSurvey(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  publishSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      const survey = await this.service.publishSurvey(id, userId);
      res.json(survey);
    } catch (error) {
      next(error);
    }
  };

  closeSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      const survey = await this.service.closeSurvey(id, userId);
      res.json(survey);
    } catch (error) {
      next(error);
    }
  };

  getSurveyStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      const stats = await this.service.getSurveyStats(id, userId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}
