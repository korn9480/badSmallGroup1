import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeepPartial,
  OneToMany,
} from 'typeorm';
import { ActivityType } from './activity-type.entity'; // Make sure to import ActivityType entity
import { User } from 'src/users/entities/user.entity';
import { Asset } from 'src/asset/entities/asset.entity';

@Entity({
  name: 'activity',
})
export class Activity {
  @ApiProperty({
    description: 'ID of activity',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the activity', example: 'Workshop' })
  @Column({ name: 'name_activity' })
  nameActivity: string;

  @ApiProperty({
    description: 'Location of the activity',
    example: 'Meeting Room A',
  })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ description: 'Details of the activity' })
  @Column({ type: 'text', nullable: true })
  details: string;

  @ApiProperty({ description: 'Number of participants', example: 20 })
  @Column({ nullable: true })
  participants: number;

  @ApiProperty({ description: 'Start date and time of the activity' })
  @Column({ name: 'date_time_start', nullable: true, type: 'date' })
  dateTimeStart: Date;

  @ApiProperty({ description: 'End date and time of the activity' })
  @Column({
    name: 'date_time_end',
    nullable: true,
    type: 'date',
    default: null,
  })
  dateTimeEnd: Date;

  @ApiProperty({ description: 'Date and time when the activity was created' })
  @CreateDateColumn({ name: 'date_time_created' })
  dateTimeCreated: Date;

  @ApiProperty({ description: '' })
  @Column({ name: 'is_open_join', nullable: true, default: true })
  is_open_join: boolean;

  @ApiProperty({ description: 'Type of the activity (foreign key)' })
  @ManyToOne(() => ActivityType, { nullable: true })
  @JoinColumn({ name: 'type' })
  type: DeepPartial<ActivityType>;

  @ApiProperty({
    description: 'Added by (user who added the activity)',
    example: 'admin',
  })
  @ManyToOne(() => User)
  addBy: DeepPartial<User>;

  @ApiProperty({ description: 'Updated date of the activity' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'asset of activity' })
  @OneToMany(() => Asset, (a) => a.activityId)
  asset: DeepPartial<Asset>[];
}
