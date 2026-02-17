import { AppDataSource } from '../../config/database';
import { Question, QuestionType } from './question.entity';

export class QuestionRepository {
  private repository = AppDataSource.getRepository(Question);

  async findBySurveyId(surveyId: number) {
    return this.repository.find({
      where: { surveyId },
      order: { order: 'ASC' }
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id }
    });
  }

  async create(data: {
    surveyId: number;
    title: string;
    type: QuestionType;
    options?: string;
    order: number;
    required: boolean;
  }) {
    const question = this.repository.create(data);
    return this.repository.save(question);
  }

  async createMany(questions: Array<{
    surveyId: number;
    title: string;
    type: QuestionType;
    options?: string;
    order: number;
    required: boolean;
  }>) {
    const entities = this.repository.create(questions);
    return this.repository.save(entities);
  }

  async update(id: number, data: Partial<Question>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async deleteBySurveyId(surveyId: number) {
    await this.repository.delete({ surveyId });
  }
}
