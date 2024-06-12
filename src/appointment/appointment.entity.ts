import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puppy } from '../puppy/puppy.entity';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @ManyToOne(() => Puppy, { cascade: true })
  puppy: Puppy;

  @Column()
  order: number;

  @Column()
  service: string;

  @Column()
  arrivalTime: Date;

  @Column()
  attended: boolean;
}
