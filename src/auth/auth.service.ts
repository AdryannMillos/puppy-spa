import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { AuthDto } from './dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async signin(dto: AuthDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (!userFound) {
        throw new ForbiddenException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        dto.password,
        userFound.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.signToken(userFound);
    } catch (error) {
      throw error;
    }
  }

  async signToken(user: User): Promise<{ access_token: string }> {
    const payload = { userId: user.id, email: user.email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: process.env.JWT_SECRET || 'secret',
    });
    return {
      access_token: token,
    };
  }
}
