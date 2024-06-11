import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { Puppy } from '../puppy/puppy.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('waiting-list')
@UseGuards(JwtAuthGuard)
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post(':date/add-puppy')
  async addPuppy(
    @Param('date') date: string,
    @Body() puppyData: Partial<Puppy>,
  ) {
    return this.waitingListService.addPuppy(date, puppyData);
  }

  @Post(':date/reorder')
  async reorderPuppies(
    @Param('date') date: string,
    @Body() orders: { puppyId: number; order: number }[],
  ) {
    await this.waitingListService.reorderPuppies(date, orders);
  }

  @Get(':date')
  async getWaitingList(@Param('date') date: string) {
    return this.waitingListService.getWaitingList(date);
  }
}
