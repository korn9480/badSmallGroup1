import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Activity } from '../entities/activity.entity';
import { ApiProperty } from '@nestjs/swagger';

export class JoinActivityDto {
  @ApiProperty({ description: 'Name of the activity', example: '64021700' })
  @IsNotEmpty()
  @IsString()
  student: DeepPartial<User>;

  @ApiProperty({ description: 'Name of the activity', example: 2 })
  @IsNotEmpty()
  @IsInt()
  activity: DeepPartial<Activity>;

  @ApiProperty({ description: 'Name of the activity', example: 2 })
  @IsNotEmpty()
  @IsBoolean()
  isJoin: boolean;
}
