import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Puppy } from '../puppy/puppy.entity';
import { AppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Puppy)
    private readonly puppyRepository: Repository<Puppy>,
  ) {}

  async schedulePuppy(dto: AppointmentDto): Promise<Appointment> {
    try {
      const puppy = await this.puppyRepository.findOneBy({ id: dto.puppyId });

      if (!puppy) {
        throw new NotFoundException('Puppy not found.');
      }

      const order = await this.getNextOrder(dto.date);
      const appointment = this.appointmentRepository.create({
        ...dto,
        puppy: puppy,
        order,
      });
      return this.appointmentRepository.save(appointment);
    } catch (error) {
      throw error;
    }
  }

  async getNextOrder(date: string): Promise<number> {
    try {
      const lastEntry = await this.appointmentRepository.findOne({
        where: { date },
        order: { order: 'DESC' },
      });
      return lastEntry ? lastEntry.order + 1 : 1;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<Appointment[]> {
    try {
      return this.appointmentRepository.find({
        where: { id },
        order: { order: 'ASC' },
        relations: ['puppy'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll(
    date?: string,
  ): Promise<{ attended: Appointment[]; unattended: Appointment[] }> {
    try {
      const queryBuilder = this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.puppy', 'puppy');

      if (date) {
        queryBuilder.where('appointment.date = :date', { date });
      }

      const attendedAppointments = await queryBuilder
        .clone()
        .andWhere('appointment.attended = true')
        .getMany();
      const unattendedAppointments = await queryBuilder
        .clone()
        .andWhere('appointment.attended = false')
        .getMany();

      return {
        attended: attendedAppointments,
        unattended: unattendedAppointments,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    appointmentDto: AppointmentDto,
  ): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['puppy'],
      });
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      const { puppyId, ...appointmentData } = appointmentDto;

      if (puppyId && puppyId !== appointment.puppy.id) {
        const puppy = await this.puppyRepository.findOneBy({ id: puppyId });
        if (!puppy) {
          throw new NotFoundException('Puppy not found');
        }
        appointment.puppy = puppy;
      }

      Object.assign(appointment, appointmentData);
      return this.appointmentRepository.save(appointment);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.appointmentRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException('Appointment not found.');
      }
    } catch (error) {
      throw error;
    }
  }
}
