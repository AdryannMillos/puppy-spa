import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class AppointmentDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  date: string;

  @IsString()
  service: string;

  @IsDateString()
  arrivalTime: Date;

  @IsBoolean()
  attended: boolean;

  @IsNumber()
  @IsNotEmpty()
  puppyId: number;
}
