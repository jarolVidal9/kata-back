import { AppDataSource } from '../../config/database';
import { User } from './user.entity';
import { Repository } from 'typeorm';

export class AuthRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({ select: ['id', 'name', 'email', 'isActive', 'createdAt'] });
  }
}
