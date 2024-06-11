import { Module } from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { PuppyController } from './puppy.controller';
import { Puppy } from './puppy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Puppy])],
  providers: [PuppyService],
  controllers: [PuppyController],
})
export class PuppyModule {}
