import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PuppyDto } from './dto';

@Controller('puppy')
@UseGuards(JwtAuthGuard)
export class PuppyController {
  constructor(private readonly puppyService: PuppyService) {}

  @Post('store')
  store(
    @Body()
    dto: PuppyDto,
  ) {
    return this.puppyService.create(dto);
  }

  @Put(':id/update')
  update(
    @Param('id') puppyId: number,
    @Body()
    dto: PuppyDto,
  ) {
    return this.puppyService.edit(puppyId, dto);
  }

  @Get('/')
  index() {
    return this.puppyService.getAll();
  }

  @Get(':id')
  show(@Param('id') puppyId: number) {
    return this.puppyService.getById(puppyId);
  }

  @Delete(':id')
  destroy(@Param('id') puppyId: number) {
    return this.puppyService.delete(puppyId);
  }
}
