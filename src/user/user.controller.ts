import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: { name: string; password: string; role: string },
  ) {
    return this.userService.create(
      createUserDto.name,
      createUserDto.password,
      createUserDto.role,
    );
  }
}
