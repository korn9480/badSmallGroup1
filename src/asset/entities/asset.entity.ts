import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activity/entities/activity.entity';
import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Asset } from './asset.entity';

@Entity({
  name: 'asset_type',
})
export class AssetType {
  @ApiProperty({ description: 'ID of asset type' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of asset type' })
  @Column({ length: 255 })
  name_type: string;

  @ApiProperty({ description: 'Assets of this type' })
  @OneToMany(() => Asset, (asset) => asset.type)
  assets: Asset[];

  // Add other properties as needed

  // Define relationships and constraints
}

@Entity({
  name: 'asset',
})
export class Asset {
  @ApiProperty({ description: 'ID of asset' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Path of asset' })
  @Column({ length: 255 })
  path: string;

  @ApiProperty({ description: 'Type of asset' })
  @ManyToOne(() => AssetType, { nullable: true })
  @JoinColumn({ name: 'type' })
  type: AssetType;

  @ApiProperty({ description: 'asset of image' })
  @ManyToOne(() => Activity, (a) => a.id, { nullable: true })
  @JoinColumn({ name: 'activityId' })
  activityId: Activity;
  // Add other properties as needed

  // Define relationships and constraints
}
