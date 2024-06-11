import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puppy } from '../puppy/puppy.entity';

@Entity({ name: 'waiting_lists' })
export class WaitingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @ManyToOne(() => Puppy, { cascade: true })
  puppy: Puppy;

  @Column()
  order: number;

  @Column()
  serviceType: string;

  @Column()
  arrivalTime: Date;

  @Column()
  attended: boolean;
}
