import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitingList } from './waiting-list.entity';
import { Puppy } from '../puppy/puppy.entity';

@Injectable()
export class WaitingListService {
  constructor(
    @InjectRepository(WaitingList)
    private readonly waitingListRepository: Repository<WaitingList>,
    @InjectRepository(Puppy)
    private readonly puppyRepository: Repository<Puppy>,
  ) {}

  async addPuppy(
    date: string,
    puppyData: Partial<Puppy>,
  ): Promise<WaitingList> {
    const puppy = await this.puppyRepository.save(puppyData);
    const order = await this.getNextOrder(date);
    const waitingList = this.waitingListRepository.create({
      date,
      puppy,
      order,
    });
    return this.waitingListRepository.save(waitingList);
  }

  async getNextOrder(date: string): Promise<number> {
    const lastEntry = await this.waitingListRepository.findOne({
      where: { date },
      order: { order: 'DESC' },
    });
    return lastEntry ? lastEntry.order + 1 : 1;
  }

  async reorderPuppies(
    date: string,
    orders: { puppyId: number; order: number }[],
  ): Promise<void> {
    for (const { puppyId, order } of orders) {
      await this.waitingListRepository.update(
        { puppy: { id: puppyId }, date },
        { order },
      );
    }
  }

  async getWaitingList(date: string): Promise<WaitingList[]> {
    return this.waitingListRepository.find({
      where: { date },
      order: { order: 'ASC' },
      relations: ['puppy'],
    });
  }
}
