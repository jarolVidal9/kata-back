import { AppDataSource } from '../../config/database';
import { Survey, SurveyStatus } from './survey.entity';

export class SurveyRepository {
  private repository = AppDataSource.getRepository(Survey);

  async findAll(userId: number) {
    return this.repository.find({
      where: { createdBy: userId },
      relations: ['questions'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['questions', 'creator']
    });
  }

  async findByIdAndUser(id: number, userId: number) {
    return this.repository.findOne({
      where: { id, createdBy: userId },
      relations: ['questions']
    });
  }

  async findPublishedById(id: number) {
    return this.repository.findOne({
      where: { id, status: SurveyStatus.PUBLISHED },
      relations: ['questions']
    });
  }

  async create(data: {
    title: string;
    description?: string;
    status?: SurveyStatus;
    expiresAt?: Date;
    createdBy: number;
  }) {
    const survey = this.repository.create(data);
    return this.repository.save(survey);
  }

  async update(id: number, data: Partial<Survey>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async countByUser(userId: number) {
    return this.repository.count({
      where: { createdBy: userId }
    });
  }

  async countResponsesBySurvey(surveyId: number) {
    const survey = await this.repository.findOne({
      where: { id: surveyId },
      relations: ['responses']
    });
    return survey?.responses?.length || 0;
  }
}
