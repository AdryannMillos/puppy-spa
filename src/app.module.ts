import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puppy } from './puppy/puppy.entity';
import { WaitingList } from './waiting-list/waiting-list.entity';
import { PuppyModule } from './puppy/puppy.module';
import { WaitingListModule } from './waiting-list/waiting-list.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB_NAME,
      entities: [Puppy, WaitingList, User],
      synchronize: true,
    }),
    PuppyModule,
    WaitingListModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
