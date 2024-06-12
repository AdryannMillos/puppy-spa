import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, dto: UserDto): Promise<User> {
    try {
      const userFound = await this.userRepository.findOneBy({ id: userId });

      if (!userFound) {
        throw new NotFoundException('User Not Found!');
      }

      if (userFound.role !== 'admin') {
        throw new ForbiddenException('Only admin users can create new users!');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new ForbiddenException(
          'Password and confirm password must match!',
        );
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(dto.password)) {
        throw new ForbiddenException(
          'Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter, and a special character, and be at least 8 characters long!',
        );
      }

      const emailFound = await this.userRepository.findOneBy({
        email: dto.email,
      });

      if (emailFound) {
        throw new ForbiddenException('Email already in use!');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const newUser = this.userRepository.create({
        name: dto.name,
        password: hashedPassword,
        role: dto.role,
        email: dto.email,
      });

      const createdUser = await this.userRepository.save(newUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }
}

// async findOne(name: string): Promise<User | undefined> {
//   return this.userRepository.findOne({ where: { name } });
// }
