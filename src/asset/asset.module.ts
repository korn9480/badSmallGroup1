import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset, AssetType } from './entities/asset.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityService } from 'src/activity/activity.service';
import { OwnerAuthGuard } from 'src/auth/guards/owner-auth.guard';
import { JoinActivity } from 'src/activity/entities/joinActivities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetType, Activity, JoinActivity]),
  ],
  controllers: [AssetController],
  providers: [AssetService, ActivityService, OwnerAuthGuard],
})
export class AssetModule {}
