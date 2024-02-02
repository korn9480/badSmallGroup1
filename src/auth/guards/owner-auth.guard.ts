import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Param,
  Put,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Asset } from 'src/asset/entities/asset.entity';
import jwtConfig from 'src/common/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/common/constants';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { ActivityService } from 'src/activity/activity.service';
import { Reflector } from '@nestjs/core';

export enum Owner {
  activity = 'activity',
  asset = 'asset',
  allergy = 'allergy',
  user = 'usre',
}

const tableName = 'tableName';

export const OwnerTable = (table: Owner) => SetMetadata(tableName, table);

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  constructor(
    private readonly activityService: ActivityService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const table: Owner = this.reflector.get<Owner>(
      tableName,
      context.getHandler(),
    );
    const id = request.params.id_activity;
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    let data: string = '';
    if (table == Owner.asset || table == Owner.activity) {
      data = (await this.activityService.findOne(id)).addBy.code_student;
    }
    if (user.code_student != data) {
      throw new ForbiddenException(
        'You do not have permission to remove this entity',
      );
    }
    return true;
  }
}
