import { Request, Response, NextFunction } from 'express';
import { ResponseService } from './response.service';

export class ResponseController {
  private service = new ResponseService();

  getResponsesBySurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const surveyId = parseInt(req.params.surveyId as string);
      const responses = await this.service.getResponsesBySurvey(surveyId, userId);
      res.json(responses);
    } catch (error) {
      next(error);
    }
  };

  getResponseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const response = await this.service.getResponseById(id);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  submitResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const responseData = {
        ...req.body,
        ipAddress
      };
      const response = await this.service.submitResponse(responseData);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string);
      await this.service.deleteResponse(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getSurveyAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const surveyId = parseInt(req.params.surveyId as string);
      const analytics = await this.service.getSurveyAnalytics(surveyId, userId);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  };
}
