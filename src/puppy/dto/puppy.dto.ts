import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class PuppyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @IsNotEmpty()
  @IsString()
  breed: string;

  @IsNotEmpty()
  @IsDateString()
  birthday: Date;
}
