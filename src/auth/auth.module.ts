import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from './bcrypt.service';
import { User } from '../users/entities/user.entity';
import jwtConfig from '../common/config/jwt.config';
import { Role } from 'src/users/entities/role.entity';
import { UserService } from 'src/users/users.service';
import { AllergyService } from 'src/allergy/allergy.service';
import { Allergy } from 'src/allergy/entities/allergy.entity';
import { OwnerAuthGuard } from './guards/owner-auth.guard';
import { AssetService } from 'src/asset/asset.service';
import { Asset, AssetType } from 'src/asset/entities/asset.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityService } from 'src/activity/activity.service';
import { JoinActivity } from 'src/activity/entities/joinActivities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Allergy, Activity, JoinActivity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    AllergyService,
    OwnerAuthGuard,
    ActivityService,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
