import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
