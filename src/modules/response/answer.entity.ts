import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'response_id' })
  responseId!: number;

  @ManyToOne('Response', 'answers', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'response_id' })
  response!: any;

  @Column({ name: 'question_id' })
  questionId!: number;

  @ManyToOne('Question', 'answers', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: any;

  @Column({ type: 'text' })
  value!: string; // Almacena texto, o JSON para respuestas múltiples
}
