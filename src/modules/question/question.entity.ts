import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  SELECT = 'SELECT'
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'survey_id' })
  surveyId!: number;

  @ManyToOne('Survey', 'questions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  survey!: any;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.TEXT
  })
  type!: QuestionType;

  @Column({ type: 'text', nullable: true })
  options?: string; // JSON string para opciones de RADIO, CHECKBOX, SELECT

  @Column({ type: 'int' })
  order!: number;

  @Column({ type: 'boolean', default: false })
  required!: boolean;

  @OneToMany('Answer', 'question')
  answers!: any[];
}
