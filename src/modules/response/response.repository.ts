import { AppDataSource } from '../../config/database';
import { Response } from './response.entity';
import { Answer } from './answer.entity';

export class ResponseRepository {
  private repository = AppDataSource.getRepository(Response);
  private answerRepository = AppDataSource.getRepository(Answer);

  async findBySurveyId(surveyId: number) {
    return this.repository.find({
      where: { surveyId },
      relations: ['answers', 'answers.question'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['answers', 'answers.question', 'survey']
    });
  }

  async create(data: {
    surveyId: number;
    respondentName?: string;
    respondentEmail?: string;
    ipAddress?: string;
    answers: Array<{ questionId: number; value: string }>;
  }) {
    // Crear la respuesta
    const response = this.repository.create({
      surveyId: data.surveyId,
      respondentName: data.respondentName,
      respondentEmail: data.respondentEmail,
      ipAddress: data.ipAddress
    });
    
    const savedResponse = await this.repository.save(response);

    // Crear las respuestas individuales
    const answers = data.answers.map(ans => 
      this.answerRepository.create({
        responseId: savedResponse.id,
        questionId: ans.questionId,
        value: ans.value
      })
    );

    await this.answerRepository.save(answers);

    return this.findById(savedResponse.id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async countBySurvey(surveyId: number) {
    return this.repository.count({
      where: { surveyId }
    });
  }
}
