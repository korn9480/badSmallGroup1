import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { Role } from './entities/role.entity';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
import { JoinActivity } from 'src/activity/entities/joinActivities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Activity, JoinActivity])],
  controllers: [UsersController],
  providers: [UserService, ActivityService],
})
export class UsersModule {}
