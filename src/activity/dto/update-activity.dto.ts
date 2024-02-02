import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends CreateActivityDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
