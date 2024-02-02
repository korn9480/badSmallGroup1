import { ApiProperty } from '@nestjs/swagger';
// import { Activity } from 'src/activity/entities/activity.entity';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { User } from;
import { Activity } from './activity.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('join_activities')
export class JoinActivity {
  // @ApiProperty({
  //   description: 'ID of the join activity',
  //   example: 1,
  // })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Student code', example: '64021708' })
  @ManyToOne(() => User, (u) => u.code_student)
  @JoinColumn({ name: 'student' })
  student: DeepPartial<User>;

  @ApiProperty({ description: 'Reference to the activity' })
  @ManyToOne(() => Activity, (a) => a.id)
  @JoinColumn({ name: 'activity' })
  activity: DeepPartial<Activity>;

  @ApiProperty({ description: 'is join activity' })
  @Column({ name: 'is_join', default: true })
  isJoin: boolean;
}
