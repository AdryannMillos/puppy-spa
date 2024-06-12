import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { GetUser } from '../auth/decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  store(
    @GetUser('id') userId: number,
    @Body()
    dto: UserDto,
  ) {
    return this.userService.create(userId, dto);
  }
}
