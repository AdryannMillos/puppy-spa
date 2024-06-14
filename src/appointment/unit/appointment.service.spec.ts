import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Appointment } from './../appointment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { Puppy } from '../../puppy/puppy.entity';

const mockAppointmentRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
});

const mockPuppyRepository = () => ({
  findOneBy: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepository: MockRepository<Appointment>;
  let puppyRepository: MockRepository<Puppy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository(),
        },
        {
          provide: getRepositoryToken(Puppy),
          useValue: mockPuppyRepository(),
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentRepository = module.get<MockRepository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    puppyRepository = module.get<MockRepository<Puppy>>(
      getRepositoryToken(Puppy),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('schedulePuppy', () => {
    it('should create and save an appointment', async () => {
      const dto = {
        date: '2023-06-10',
        puppyId: 1,
        order: 1,
        service: 'Grooming',
        arrivalTime: new Date(),
        attended: false,
      };
      const puppy = { id: 1, name: 'Buddy' };
      const appointment = { id: 1, ...dto, puppy };

      puppyRepository.findOneBy.mockResolvedValue(puppy);
      appointmentRepository.create.mockReturnValue(appointment);
      appointmentRepository.save.mockResolvedValue(appointment);

      expect(await service.schedulePuppy(dto)).toEqual(appointment);
      expect(puppyRepository.findOneBy).toHaveBeenCalledWith({
        id: dto.puppyId,
      });
      expect(appointmentRepository.create).toHaveBeenCalledWith({
        ...dto,
        puppy,
        order: 1,
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(appointment);
    });

    it('should throw a NotFoundException if puppy is not found', async () => {
      const dto = {
        date: '2023-06-10',
        puppyId: 1,
        order: 1,
        service: 'Grooming',
        arrivalTime: new Date(),
        attended: false,
      };
      puppyRepository.findOneBy.mockResolvedValue(null);

      await expect(service.schedulePuppy(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getNextOrder', () => {
    it('should return the next order number', async () => {
      const date = '2023-06-10';
      const lastEntry = { id: 1, order: 1 };

      appointmentRepository.findOne.mockResolvedValue(lastEntry);

      expect(await service.getNextOrder(date)).toEqual(2);
    });

    it('should return 1 if no entries exist for the date', async () => {
      const date = '2023-06-10';
      appointmentRepository.findOne.mockResolvedValue(null);

      expect(await service.getNextOrder(date)).toEqual(1);
    });
  });

  describe('getOne', () => {
    it('should return an appointment by id', async () => {
      const id = 1;
      const appointment = {
        id,
        date: '2023-06-10',
        puppy: { id: 1, name: 'Buddy' },
      };
      appointmentRepository.find.mockResolvedValue([appointment]);

      expect(await service.getOne(id)).toEqual([appointment]);
      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: { id },
        order: { order: 'ASC' },
        relations: ['puppy'],
      });
    });
  });

  describe('getAll', () => {
    it('should return attended and unattended appointments without date', async () => {
      const attendedAppointments = [{ id: 1, attended: true }];
      const unattendedAppointments = [{ id: 2, attended: false }];

      const queryBuilderMock = appointmentRepository.createQueryBuilder();
      queryBuilderMock.andWhere
        .mockReturnValueOnce(queryBuilderMock)
        .mockReturnValueOnce(queryBuilderMock);
      queryBuilderMock.getMany
        .mockResolvedValueOnce(attendedAppointments)
        .mockResolvedValueOnce(unattendedAppointments);

      const result = await service.getAll();

      expect(result).toEqual({
        attended: attendedAppointments,
        unattended: unattendedAppointments,
      });

      expect(appointmentRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(queryBuilderMock.andWhere).toHaveBeenNthCalledWith(
        1,
        'appointment.attended = true',
      );
      expect(queryBuilderMock.andWhere).toHaveBeenNthCalledWith(
        2,
        'appointment.attended = false',
      );
    });

    it('should return attended and unattended appointments with date', async () => {
      const date = '2023-01-01';
      const attendedAppointments = [{ id: 1, attended: true, date }];
      const unattendedAppointments = [{ id: 2, attended: false, date }];

      const queryBuilderMock = appointmentRepository.createQueryBuilder();
      queryBuilderMock.where
        .mockReturnValueOnce(queryBuilderMock)
        .mockReturnValueOnce(queryBuilderMock);
      queryBuilderMock.andWhere
        .mockReturnValueOnce(queryBuilderMock)
        .mockReturnValueOnce(queryBuilderMock);
      queryBuilderMock.getMany
        .mockResolvedValueOnce(attendedAppointments)
        .mockResolvedValueOnce(unattendedAppointments);

      const result = await service.getAll(date);

      expect(result).toEqual({
        attended: attendedAppointments,
        unattended: unattendedAppointments,
      });

      expect(appointmentRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'appointment.date = :date',
        { date },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenNthCalledWith(
        1,
        'appointment.attended = true',
      );
      expect(queryBuilderMock.andWhere).toHaveBeenNthCalledWith(
        2,
        'appointment.attended = false',
      );
    });

    it('should throw an error if query fails', async () => {
      const errorMessage = 'Database error';
      const queryBuilderMock = appointmentRepository.createQueryBuilder();
      queryBuilderMock.getMany.mockRejectedValue(new Error(errorMessage));

      await expect(service.getAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const id = 1;
      const appointmentDto = {
        date: '2023-06-10',
        puppyId: 1,
        order: 1,
        service: 'Grooming',
        arrivalTime: new Date(),
        attended: false,
      };
      const appointment = {
        id,
        ...appointmentDto,
        puppy: { id: 1, name: 'Buddy' },
      };

      appointmentRepository.findOne.mockResolvedValue(appointment);
      puppyRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Buddy' });
      appointmentRepository.save.mockResolvedValue(appointment);

      expect(await service.update(id, appointmentDto)).toEqual(appointment);
      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['puppy'],
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith({
        ...appointment,
        ...appointmentDto,
      });
    });

    it('should throw a NotFoundException if appointment is not found', async () => {
      const id = 1;
      const appointmentDto = {
        date: '2023-06-10',
        puppyId: 1,
        order: 1,
        service: 'Grooming',
        arrivalTime: new Date(),
        attended: false,
      };
      appointmentRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, appointmentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException if puppy is not found', async () => {
      const id = 1;
      const appointmentDto = {
        date: '2023-06-10',
        puppyId: 1,
        order: 1,
        service: 'Grooming',
        arrivalTime: new Date(),
        attended: false,
      };
      const appointment = {
        id,
        ...appointmentDto,
        puppy: { id: 2, name: 'Max' },
      };

      appointmentRepository.findOne.mockResolvedValue(appointment);
      puppyRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(id, appointmentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an appointment', async () => {
      const id = 1;
      appointmentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(id);
      expect(appointmentRepository.delete).toHaveBeenCalledWith({ id });
    });

    it('should throw a NotFoundException if appointment is not found', async () => {
      const id = 1;
      appointmentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
