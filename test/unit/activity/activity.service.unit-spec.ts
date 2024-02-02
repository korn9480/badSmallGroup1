import { Test } from '@nestjs/testing';
import { ActivityService } from '../../../src/activity/activity.service';
import { AssetService } from '../../../src/asset/asset.service';
import { Repository } from 'typeorm';
import { Activity } from 'src/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/activity/dto/create-activity.dto';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let activityRepository: Repository<Activity>;
  // let AssetService : AssetService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ActivityService,
        AssetService,
        { provide: Repository, useValue: Activity },
      ],
    }).compile();
    activityService = moduleRef.get<ActivityService>(ActivityService);
  });

  describe('create', () => {
    const form: CreateActivityDto = {
      nameActivity: 'ทดสอบ',
    };
    it('should create a new user', async () => {
      const createSpy = jest.spyOn(activityRepository, 'create');
      const saveSpy = jest.spyOn(activityRepository, 'save');

      await activityService.create();
    });
  });
});
