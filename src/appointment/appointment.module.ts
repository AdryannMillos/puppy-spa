import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Puppy } from 'src/puppy/puppy.entity';
import { Appointment } from './appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Puppy, Appointment])],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class WaitingListModule {}
