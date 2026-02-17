import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../auth/user.entity';

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED'
}

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: SurveyStatus,
    default: SurveyStatus.DRAFT
  })
  status!: SurveyStatus;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @OneToMany('Question', 'survey', { cascade: true })
  questions!: any[];

  @OneToMany('Response', 'survey')
  responses!: any[];

  @Column({ type: 'datetime', nullable: true, name: 'expires_at' })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
