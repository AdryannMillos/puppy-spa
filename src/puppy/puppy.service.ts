import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puppy } from './puppy.entity';
import { PuppyDto } from './dto';

@Injectable()
export class PuppyService {
  constructor(
    @InjectRepository(Puppy)
    private readonly puppyRepository: Repository<Puppy>,
  ) {}

  async create(puppyData: PuppyDto): Promise<Puppy> {
    try {
      const puppy = this.puppyRepository.create(puppyData);
      return await this.puppyRepository.save(puppy);
    } catch (error) {
      throw error;
    }
  }

  async edit(puppyId, puppyData: Partial<Puppy>): Promise<Puppy> {
    try {
      const puppy = await this.puppyRepository.findOneBy({ id: puppyId });
      if (!puppy) {
        throw new NotFoundException('Puppy not found.');
      }
      Object.assign(puppy, puppyData);
      return await this.puppyRepository.save(puppy);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Puppy[]> {
    try {
      return await this.puppyRepository.find();
    } catch (error) {
      throw new NotFoundException('Failed to get puppies.');
    }
  }

  async getById(puppyId: number): Promise<Puppy> {
    try {
      const puppy = await this.puppyRepository.findOneBy({ id: puppyId });
      if (!puppy) {
        throw new NotFoundException('Puppy not found.');
      }
      return puppy;
    } catch (error) {
      throw error;
    }
  }

  async delete(puppyId: number): Promise<void> {
    try {
      const result = await this.puppyRepository.delete(puppyId);
      if (result.affected === 0) {
        throw new NotFoundException('Puppy not found.');
      }
    } catch (error) {
      throw error;
    }
  }
}
