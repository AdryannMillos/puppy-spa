import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, password: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async findOne(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { name } });
  }
}
