import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Activity } from 'src/activity/entities/activity.entity';
import { DeepPartial } from 'typeorm';
import { CreateAssetDto } from './create-asset.dto';

export class UpdateAssetDto extends CreateAssetDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
export class FormUpdateAsset {
  id_delet: number[];
  asset: UpdateAssetDto[];
}
