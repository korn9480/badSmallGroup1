import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { ActivityType } from './entities/activity-type.entity';
import { JoinActivity } from './entities/joinActivities.entity';
import { Asset, AssetType } from 'src/asset/entities/asset.entity';
import { AssetService } from 'src/asset/asset.service';
// import {ActivityTypeSeed} from './activity-type.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      ActivityType,
      JoinActivity,
      Asset,
      AssetType,
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, AssetService],
  exports: [TypeOrmModule],
})
export class ActivityModule {}
