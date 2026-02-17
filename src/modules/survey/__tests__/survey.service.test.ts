import { SurveyService } from '../survey.service';
import { SurveyRepository } from '../survey.repository';
import { QuestionRepository } from '../../question/question.repository';
import { NotFoundError, BadRequestError, AppError } from '../../../shared/errors/AppError';
import { SurveyStatus } from '../survey.entity';
import { QuestionType } from '../../question/question.entity';

// Mock de los repositorios
jest.mock('../survey.repository');
jest.mock('../../question/question.repository');

describe('SurveyService', () => {
  let surveyService: SurveyService;
  let mockSurveyRepo: jest.Mocked<SurveyRepository>;
  let mockQuestionRepo: jest.Mocked<QuestionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    surveyService = new SurveyService();
    mockSurveyRepo = (surveyService as any).surveyRepo;
    mockQuestionRepo = (surveyService as any).questionRepo;
  });

  describe('getMySurveys', () => {
    it('debe retornar todas las encuestas del usuario', async () => {
      // Arrange
      const userId = 1;
      const mockSurveys = [
        { id: 1, title: 'Encuesta 1', createdBy: userId },
        { id: 2, title: 'Encuesta 2', createdBy: userId },
      ];

      mockSurveyRepo.findAll.mockResolvedValue(mockSurveys as any);

      // Act
      const result = await surveyService.getMySurveys(userId);

      // Assert
      expect(mockSurveyRepo.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockSurveys);
      expect(result).toHaveLength(2);
    });
  });

  describe('getSurveyById', () => {
    it('debe retornar una encuesta por ID si pertenece al usuario', async () => {
      // Arrange
      const surveyId = 1;
      const userId = 1;
      const mockSurvey = {
        id: surveyId,
        title: 'Mi Encuesta',
        createdBy: userId,
      };

      mockSurveyRepo.findByIdAndUser.mockResolvedValue(mockSurvey as any);

      // Act
      const result = await surveyService.getSurveyById(surveyId, userId);

      // Assert
      expect(mockSurveyRepo.findByIdAndUser).toHaveBeenCalledWith(surveyId, userId);
      expect(result).toEqual(mockSurvey);
    });

    it('debe lanzar NotFoundError si la encuesta no existe', async () => {
      // Arrange
      mockSurveyRepo.findByIdAndUser.mockResolvedValue(null);

      // Act & Assert
      await expect(surveyService.getSurveyById(1, 1)).rejects.toThrow(
        new NotFoundError('Encuesta no encontrada')
      );
    });
  });

  describe('getPublicSurvey', () => {
    it('debe retornar una encuesta publicada válida', async () => {
      // Arrange
      const mockSurvey = {
        id: 1,
        title: 'Encuesta Pública',
        status: SurveyStatus.PUBLISHED,
        expiresAt: new Date(Date.now() + 86400000), // Mañana
      };

      mockSurveyRepo.findPublishedById.mockResolvedValue(mockSurvey as any);

      // Act
      const result = await surveyService.getPublicSurvey(1);

      // Assert
      expect(mockSurveyRepo.findPublishedById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSurvey);
    });

    it('debe lanzar NotFoundError si la encuesta no está publicada', async () => {
      // Arrange
      mockSurveyRepo.findPublishedById.mockResolvedValue(null);

      // Act & Assert
      await expect(surveyService.getPublicSurvey(1)).rejects.toThrow(
        new NotFoundError('Encuesta no disponible')
      );
    });

    it('debe lanzar error 410 si la encuesta ha expirado', async () => {
      // Arrange
      const mockSurvey = {
        id: 1,
        title: 'Encuesta Expirada',
        status: SurveyStatus.PUBLISHED,
        expiresAt: new Date(Date.now() - 86400000), // Ayer
      };

      mockSurveyRepo.findPublishedById.mockResolvedValue(mockSurvey as any);

      // Act & Assert
      await expect(surveyService.getPublicSurvey(1)).rejects.toThrow(
        new AppError(410, 'Esta encuesta ha expirado')
      );
    });
  });

  describe('createSurvey', () => {
    const userId = 1;
    const surveyData = {
      title: 'Nueva Encuesta',
      description: 'Descripción de prueba',
      status: SurveyStatus.DRAFT,
      questions: [
        {
          title: '¿Te gusta el producto?',
          type: QuestionType.RADIO,
          options: ['Sí', 'No', 'Tal vez'],
          order: 1,
          required: true,
        },
      ],
    };

    it('debe crear una encuesta con preguntas exitosamente', async () => {
      // Arrange
      const mockCreatedSurvey = {
        id: 1,
        ...surveyData,
        createdBy: userId,
      };

      mockSurveyRepo.create.mockResolvedValue({ id: 1 } as any);
      mockSurveyRepo.findById.mockResolvedValue(mockCreatedSurvey as any);
      mockQuestionRepo.createMany.mockResolvedValue([] as any);

      // Act
      const result = await surveyService.createSurvey(surveyData, userId);

      // Assert
      expect(mockSurveyRepo.create).toHaveBeenCalledWith({
        title: surveyData.title,
        description: surveyData.description,
        status: surveyData.status,
        expiresAt: undefined,
        createdBy: userId,
      });
      expect(mockQuestionRepo.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            surveyId: 1,
            title: surveyData.questions[0].title,
            type: surveyData.questions[0].type,
          }),
        ])
      );
      expect(mockSurveyRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCreatedSurvey);
    });

    it('debe lanzar BadRequestError si falta el título', async () => {
      // Act & Assert
      await expect(
        surveyService.createSurvey({ ...surveyData, title: '' }, userId)
      ).rejects.toThrow(new BadRequestError('El título es requerido'));

      await expect(
        surveyService.createSurvey({ ...surveyData, title: '   ' }, userId)
      ).rejects.toThrow(new BadRequestError('El título es requerido'));
    });

    it('debe crear encuesta sin preguntas si no se proporcionan', async () => {
      // Arrange
      const dataWithoutQuestions = {
        title: 'Encuesta sin preguntas',
        description: 'Test',
      };

      mockSurveyRepo.create.mockResolvedValue({ id: 1 } as any);
      mockSurveyRepo.findById.mockResolvedValue({ id: 1 } as any);

      // Act
      await surveyService.createSurvey(dataWithoutQuestions, userId);

      // Assert
      expect(mockQuestionRepo.createMany).not.toHaveBeenCalled();
    });
  });

  describe('updateSurvey', () => {
    const surveyId = 1;
    const userId = 1;

    it('debe actualizar una encuesta exitosamente', async () => {
      // Arrange
      const mockExistingSurvey = {
        id: surveyId,
        title: 'Encuesta Original',
        questions: [],
      };

      const updateData = {
        title: 'Encuesta Actualizada',
        description: 'Nueva descripción',
      };

      mockSurveyRepo.findByIdAndUser.mockResolvedValue(mockExistingSurvey as any);
      mockSurveyRepo.update.mockResolvedValue(undefined as any);
      mockSurveyRepo.findById.mockResolvedValue({
        ...mockExistingSurvey,
        ...updateData,
      } as any);

      // Act
      const result = await surveyService.updateSurvey(surveyId, updateData, userId);

      // Assert
      expect(mockSurveyRepo.findByIdAndUser).toHaveBeenCalledWith(surveyId, userId);
      expect(mockSurveyRepo.update).toHaveBeenCalledWith(surveyId, updateData);
      expect(result).toBeDefined();
      expect(result?.title).toBe(updateData.title);
    });

    it('debe lanzar NotFoundError si la encuesta no existe', async () => {
      // Arrange
      mockSurveyRepo.findByIdAndUser.mockResolvedValue(null);

      // Act & Assert
      await expect(
        surveyService.updateSurvey(surveyId, { title: 'Test' }, userId)
      ).rejects.toThrow(new NotFoundError('Encuesta no encontrada'));
    });

    it('debe lanzar error al intentar publicar encuesta sin preguntas', async () => {
      // Arrange
      const mockExistingSurvey = {
        id: surveyId,
        title: 'Encuesta Sin Preguntas',
        questions: [],
      };

      mockSurveyRepo.findByIdAndUser.mockResolvedValue(mockExistingSurvey as any);

      // Act & Assert
      await expect(
        surveyService.updateSurvey(
          surveyId,
          { status: SurveyStatus.PUBLISHED },
          userId
        )
      ).rejects.toThrow(
        new BadRequestError('No se puede publicar una encuesta sin preguntas')
      );
    });
  });

  describe('deleteSurvey', () => {
    it('debe eliminar una encuesta exitosamente', async () => {
      // Arrange
      const surveyId = 1;
      const userId = 1;
      const mockSurvey = { id: surveyId, title: 'Encuesta a eliminar' };

      mockSurveyRepo.findByIdAndUser.mockResolvedValue(mockSurvey as any);
      mockSurveyRepo.delete.mockResolvedValue(undefined as any);

      // Act
      await surveyService.deleteSurvey(surveyId, userId);

      // Assert
      expect(mockSurveyRepo.findByIdAndUser).toHaveBeenCalledWith(surveyId, userId);
      expect(mockSurveyRepo.delete).toHaveBeenCalledWith(surveyId);
    });

    it('debe lanzar NotFoundError si la encuesta no existe', async () => {
      // Arrange
      mockSurveyRepo.findByIdAndUser.mockResolvedValue(null);

      // Act & Assert
      await expect(surveyService.deleteSurvey(1, 1)).rejects.toThrow(
        new NotFoundError('Encuesta no encontrada')
      );
      expect(mockSurveyRepo.delete).not.toHaveBeenCalled();
    });
  });
});
