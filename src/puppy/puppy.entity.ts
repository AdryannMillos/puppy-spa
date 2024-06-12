import { Appointment } from '../appointment/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'puppies' })
export class Puppy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownerName: string;

  @Column()
  breed: string;

  @Column()
  birthday: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.puppy, {
    cascade: false,
  })
  appointment: Appointment;
}
