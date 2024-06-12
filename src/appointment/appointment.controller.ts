import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentDto } from './dto';

@Controller('appointment')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('/schedule-puppy')
  async addPuppy(@Body() dto: AppointmentDto) {
    return this.appointmentService.schedulePuppy(dto);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return this.appointmentService.getOne(id);
  }

  @Get('/')
  async index(@Query('date') date?: string) {
    return this.appointmentService.getAll(date);
  }

  @Put(':id/update')
  async update(
    @Param('id') id: number,
    @Body() appointmentDto: AppointmentDto,
  ) {
    return this.appointmentService.update(id, appointmentDto);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: number) {
    return this.appointmentService.delete(id);
  }
}
