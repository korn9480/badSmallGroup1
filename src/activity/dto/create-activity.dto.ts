import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsString,
  IsArray,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { ActivityType } from '../entities/activity-type.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/common/decorators/match.decorator';
import { Asset } from 'src/asset/entities/asset.entity';

export class CreateActivityDto {
  @ApiProperty({ description: 'Name of the activity', example: 'Workshop' })
  @IsNotEmpty()
  @IsString()
  nameActivity: string;

  @ApiProperty({
    description: 'Location of the activity',
    example: 'Meeting Room A',
  })
  @IsNotEmpty()
  location?: string;

  @ApiProperty({ description: 'Details of the activity' })
  @IsOptional()
  details?: string;

  @ApiProperty({ description: 'Number of participants', example: 20 })
  @IsOptional()
  @IsInt()
  participants?: number;

  @ApiProperty({ description: 'Start date and time of the activity' })
  @IsOptional()
  @IsDateString()
  dateTimeStart?: Date;

  @ApiProperty({ description: 'End date and time of the activity' })
  @IsOptional()
  @IsDateString()
  dateTimeEnd?: Date;

  @ApiProperty({ description: 'Type of the activity (foreign key)' })
  @IsOptional()
  @IsInt()
  type?: DeepPartial<ActivityType>;

  @ApiProperty({
    description: 'Added by (user who added the activity)',
    example: 1,
  })
  @IsOptional()
  addBy?: DeepPartial<User>;
}
