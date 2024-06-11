import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puppy } from './puppy.entity';

@Injectable()
export class PuppyService {
  constructor(
    @InjectRepository(Puppy)
    private readonly puppyRepository: Repository<Puppy>,
  ) {}

  async create(puppyData: Partial<Puppy>): Promise<Puppy> {
    return this.puppyRepository.save(puppyData);
  }
}
