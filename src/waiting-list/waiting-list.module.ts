import { Module } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { WaitingListController } from './waiting-list.controller';
import { Puppy } from 'src/puppy/puppy.entity';
import { WaitingList } from './waiting-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Puppy, WaitingList])],
  providers: [WaitingListService],
  controllers: [WaitingListController],
})
export class WaitingListModule {}
