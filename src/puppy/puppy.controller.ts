import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { Puppy } from './puppy.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('puppy')
@UseGuards(JwtAuthGuard)
export class PuppyController {
  constructor(private readonly puppyService: PuppyService) {}

  @Post()
  create(@Body() puppyData: Partial<Puppy>) {
    return this.puppyService.create(puppyData);
  }
}
