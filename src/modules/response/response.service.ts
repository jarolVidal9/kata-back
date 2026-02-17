import { ResponseRepository } from './response.repository';
import { SurveyRepository } from '../survey/survey.repository';
import { QuestionRepository } from '../question/question.repository';
import { AppError, NotFoundError, BadRequestError, UnauthorizedError } from '../../shared/errors/AppError';

export class ResponseService {
  private responseRepo = new ResponseRepository();
  private surveyRepo = new SurveyRepository();
  private questionRepo = new QuestionRepository();

  async getResponsesBySurvey(surveyId: number, userId: number) {
    // Verificar que la encuesta pertenezca al usuario
    const survey = await this.surveyRepo.findByIdAndUser(surveyId, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    return this.responseRepo.findBySurveyId(surveyId);
  }

  async getResponseById(id: number) {
    const response = await this.responseRepo.findById(id);
    
    if (!response) {
      throw new NotFoundError('Respuesta no encontrada');
    }

    return response;
  }

  async submitResponse(data: {
    surveyId: number;
    respondentName?: string;
    respondentEmail?: string;
    ipAddress?: string;
    answers: Array<{ questionId: number; value: string }>;
  }) {
    // Verificar que la encuesta esté publicada
    const survey = await this.surveyRepo.findPublishedById(data.surveyId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no disponible');
    }

    // Verificar si expiró
    if (survey.expiresAt && new Date(survey.expiresAt) < new Date()) {
      throw new AppError(410, 'Esta encuesta ha expirado');
    }

    // Verificar que todas las preguntas requeridas tengan respuesta
    const questions = await this.questionRepo.findBySurveyId(data.surveyId);
    const requiredQuestions = questions.filter(q => q.required);
    const answeredQuestionIds = data.answers.map(a => a.questionId);

    for (const required of requiredQuestions) {
      if (!answeredQuestionIds.includes(required.id)) {
        throw new BadRequestError(`La pregunta "${required.title}" es requerida`);
      }
    }

    // Validar que todas las preguntas respondidas pertenezcan a la encuesta
    for (const answer of data.answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw new BadRequestError('Pregunta inválida');
      }
    }

    return this.responseRepo.create(data);
  }

  async deleteResponse(id: number, userId: number) {
    const response = await this.responseRepo.findById(id);
    
    if (!response) {
      throw new NotFoundError('Respuesta no encontrada');
    }

    // Verificar que la encuesta pertenezca al usuario
    const survey = await this.surveyRepo.findByIdAndUser(response.surveyId, userId);
    
    if (!survey) {
      throw new UnauthorizedError('No tienes permiso para eliminar esta respuesta');
    }

    await this.responseRepo.delete(id);
  }

  async getSurveyAnalytics(surveyId: number, userId: number) {
    const survey = await this.surveyRepo.findByIdAndUser(surveyId, userId);
    
    if (!survey) {
      throw new NotFoundError('Encuesta no encontrada');
    }

    const responses = await this.responseRepo.findBySurveyId(surveyId);
    const questions = await this.questionRepo.findBySurveyId(surveyId);

    // Analizar respuestas por pregunta
    const analytics = questions.map(question => {
      const answers = responses.flatMap(r => 
        r.answers.filter(a => a.questionId === question.id)
      );

      return {
        questionId: question.id,
        questionTitle: question.title,
        questionType: question.type,
        totalAnswers: answers.length,
        answers: answers.map(a => a.value)
      };
    });

    return {
      survey: {
        id: survey.id,
        title: survey.title,
        status: survey.status
      },
      totalResponses: responses.length,
      analytics
    };
  }
}
