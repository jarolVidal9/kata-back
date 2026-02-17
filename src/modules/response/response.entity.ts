import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'survey_id' })
  surveyId!: number;

  @ManyToOne('Survey', 'responses', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  survey!: any;

  @OneToMany('Answer', 'response', { cascade: true })
  answers!: any[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  respondentName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  respondentEmail?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
