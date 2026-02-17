import { SurveyRepository } from './survey.repository';
import { QuestionRepository } from '../question/question.repository';
import { AppError, NotFoundError, BadRequestError } from '../../shared/errors/AppError';
import { SurveyStatus } from './survey.entity';
import { QuestionType } from '../question/question.entity';

export class SurveyService {
  private surveyRepo = new SurveyRepository();
  private questionRepo = new QuestionRepository();

  async getMySurveys(userId: number) {
    return this.surveyRepo.findAll(userId);
  }

  async getSurveyById(id: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    return survey;
  }

  async getPublicSurvey(id: number) {
    const survey = await this.surveyRepo.findPublishedById(id);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no disponible');
    }

    // Verificar si expiró
    if (survey.expiresAt && new Date(survey.expiresAt) < new Date()) {
      throw new AppError(410, 'Esta encuesta ha expirado');
    }

    return survey;
  }

  async createSurvey(
    data: {
      title: string;
      description?: string;
      status?: SurveyStatus;
      expiresAt?: string;
      questions?: Array<{
        title: string;
        type: QuestionType;
        options?: string[];
        order: number;
        required: boolean;
      }>;
    },
    userId: number
  ) {
    if (!data.title?.trim()) {
      throw new BadRequestError('El título es requerido');
    }

    const survey = await this.surveyRepo.create({
      title: data.title,
      description: data.description,
      status: data.status || SurveyStatus.DRAFT,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdBy: userId
    });

    // Crear preguntas si vienen
    if (data.questions && data.questions.length > 0) {
      const questions = data.questions.map(q => ({
        surveyId: survey.id,
        title: q.title,
        type: q.type,
        options: q.options ? JSON.stringify(q.options) : undefined,
        order: q.order,
        required: q.required
      }));

      await this.questionRepo.createMany(questions);
    }

    return this.surveyRepo.findById(survey.id);
  }

  async updateSurvey(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: SurveyStatus;
      expiresAt?: string;
      questions?: Array<{
        id?: number;
        title: string;
        type: QuestionType;
        options?: string[];
        order: number;
        required: boolean;
      }>;
    },
    userId: number
  ) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    // Actualizar survey
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }

    if (Object.keys(updateData).length > 0) {
      await this.surveyRepo.update(id, updateData);
    }

    // Actualizar preguntas si vienen
    if (data.questions) {
      // Eliminar preguntas existentes y crear nuevas (simple approach)
      await this.questionRepo.deleteBySurveyId(id);
      
      const questions = data.questions.map(q => ({
        surveyId: id,
        title: q.title,
        type: q.type,
        options: q.options ? JSON.stringify(q.options) : undefined,
        order: q.order,
        required: q.required
      }));

      await this.questionRepo.createMany(questions);
    }

    return this.surveyRepo.findById(id);
  }

  async deleteSurvey(id: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    await this.surveyRepo.delete(id);
  }

  async publishSurvey(id: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    if (survey.questions.length === 0) {
      throw new BadRequestError('No se puede publicar una encuesta sin preguntas');
    }

    return this.surveyRepo.update(id, { status: SurveyStatus.PUBLISHED });
  }

  async closeSurvey(id: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    return this.surveyRepo.update(id, { status: SurveyStatus.CLOSED });
  }

  async getSurveyStats(id: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(id, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    const responseCount = await this.surveyRepo.countResponsesBySurvey(id);

    return {
      survey,
      stats: {
        totalResponses: responseCount,
        questionCount: survey.questions.length,
        status: survey.status
      }
    };
  }
}
