import { Test, TestingModule } from '@nestjs/testing';
import { PuppyService } from '../puppy.service';
import { Repository } from 'typeorm';
import { Puppy } from '../puppy.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PuppyDto } from '../dto';

const mockPuppyRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PuppyService', () => {
  let service: PuppyService;
  let repository: MockRepository<Puppy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuppyService,
        {
          provide: getRepositoryToken(Puppy),
          useValue: mockPuppyRepository(),
        },
      ],
    }).compile();

    service = module.get<PuppyService>(PuppyService);
    repository = module.get<MockRepository<Puppy>>(getRepositoryToken(Puppy));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new puppy', async () => {
      const puppyData: PuppyDto = {
        name: 'Buddy',
        ownerName: 'John',
        breed: 'Labrador',
        birthday: new Date(),
      };
      const savedPuppy = { id: 1, ...puppyData };
      repository.create.mockReturnValue(savedPuppy);
      repository.save.mockResolvedValue(savedPuppy);

      expect(await service.create(puppyData)).toEqual(savedPuppy);
      expect(repository.create).toHaveBeenCalledWith(puppyData);
      expect(repository.save).toHaveBeenCalledWith(savedPuppy);
    });

    it('should throw an error if save fails', async () => {
      const puppyData: PuppyDto = {
        name: 'Buddy',
        ownerName: 'John',
        breed: 'Labrador',
        birthday: new Date(),
      };
      repository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(puppyData)).rejects.toThrow('Save failed');
    });
  });

  describe('edit', () => {
    it('should edit an existing puppy', async () => {
      const puppyId = 1;
      const puppyData: Partial<Puppy> = { name: 'Buddy' };
      const existingPuppy = {
        id: puppyId,
        name: 'Max',
        ownerName: 'John',
        breed: 'Labrador',
        birthday: new Date(),
      };
      const updatedPuppy = { ...existingPuppy, ...puppyData };

      repository.findOneBy.mockResolvedValue(existingPuppy);
      repository.save.mockResolvedValue(updatedPuppy);

      expect(await service.edit(puppyId, puppyData)).toEqual(updatedPuppy);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: puppyId });
      expect(repository.save).toHaveBeenCalledWith(updatedPuppy);
    });

    it('should throw an error if puppy not found', async () => {
      const puppyId = 1;
      const puppyData: Partial<Puppy> = { name: 'Buddy' };
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.edit(puppyId, puppyData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
    it('should return an array of puppies', async () => {
      const puppies = [{ id: 1, name: 'Buddy' }];
      repository.find.mockResolvedValue(puppies);

      expect(await service.getAll()).toEqual(puppies);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an error if get all fails', async () => {
      repository.find.mockRejectedValue(new Error('Failed to get puppies'));

      await expect(service.getAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getById', () => {
    it('should return a puppy by id', async () => {
      const puppyId = 1;
      const puppy = { id: puppyId, name: 'Buddy' };
      repository.findOne.mockResolvedValue(puppy);

      expect(await service.getById(puppyId)).toEqual(puppy);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: puppyId },
        relations: ['appointment'],
      });
    });

    it('should throw an error if puppy not found', async () => {
      const puppyId = 1;
      repository.findOne.mockResolvedValue(null);

      await expect(service.getById(puppyId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a puppy', async () => {
      const puppyId = 1;
      repository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(puppyId);
      expect(repository.delete).toHaveBeenCalledWith(puppyId);
    });

    it('should throw an error if puppy not found', async () => {
      const puppyId = 1;
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(puppyId)).rejects.toThrow(NotFoundException);
    });
  });
});
