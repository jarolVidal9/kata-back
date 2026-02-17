import { Request, Response, NextFunction } from 'express';
import { SurveyService } from './survey.service';

export class SurveyController {
  private service = new SurveyService();

  getMySurveys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const surveys = await this.service.getMySurveys(userId);
      res.json(surveys);
    } catch (error) {
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
}

