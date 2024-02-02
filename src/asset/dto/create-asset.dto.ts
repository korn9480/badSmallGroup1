import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Activity } from 'src/activity/entities/activity.entity';
import { DeepPartial } from 'typeorm';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
  // @IsNotEmpty()
  // @IsString()
  path: any;

  @IsOptional()
  @IsInt()
  type: number;

  @IsOptional()
  @IsInt()
  activityId: number;
}
