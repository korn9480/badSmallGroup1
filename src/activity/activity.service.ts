import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JoinActivityDto } from './dto/join-activity.dto';
import { JoinActivity } from './entities/joinActivities.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(JoinActivity)
    private readonly joinRepository: Repository<JoinActivity>,
    private connection: Connection,
  ) {}

  // method of join activity
  async findJoinActivityOne(form: JoinActivityDto) {
    const data = await this.connection
      .createQueryBuilder(JoinActivity, 'jac')
      .andWhere(
        `jac.activity = ${form.activity} AND jac.student = ${form.student} AND jac.isJoin = true`,
      )
      .getOne();
    console.log(data);
    return data;
  }

  private async getPerPloJoin(id: number): Promise<JoinActivity[]> {
    const data = await this.joinRepository.find({
      where: { activity: { id: id }, isJoin: true },
      relations: ['activity', 'student'],
    });
    return data;
  }

  async joinActivity(form: JoinActivityDto, idActivity: number) {
    const perplo = await this.getPerPloJoin(form.activity.id);
    const activity = await this.findOne(idActivity);

    if (perplo.length < activity.participants) {
      for (const p of perplo) {
        if (p.student.code_student == form.student) {
          throw new ForbiddenException('you join activity');
        }
      }
      const newJoin = this.joinRepository.create(form);
      return await this.joinRepository.save(newJoin);
    } else {
      throw new ForbiddenException('perplo join full');
    }
  }

  async cancelActivity(form: JoinActivityDto) {
    const result = await this.findJoinActivityOne(form);
    if (!result) {
      throw new NotFoundException(
        `not join activity with ID ${form.activity} not found`,
      );
    }
    return await this.joinRepository.delete(result.id);
  }
  async findPerploJoin(idActivity: number, codeStudent: string) {
    const data = await this.findOne(idActivity);
    const perplo = await this.getPerPloJoin(idActivity);
    let isJoin = false;
    // console.log(perplo)
    for (const d of perplo) {
      if (d.student.code_student == codeStudent) {
        // console.log(d.student,codeStudent)
        isJoin = true;
      }
    }
    return {
      nameActivity: data.nameActivity,
      dateTimeEnd: data.dateTimeEnd,
      dateTimeStart: data.dateTimeStart,
      location: data.location,
      participants: data.participants,
      numberPP: perplo.length,
      isJoin: isJoin,
    };
  }
  // method of activity
  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    if (createActivityDto.dateTimeEnd == createActivityDto.dateTimeStart) {
      createActivityDto.dateTimeEnd = null;
    }
    const newActivity = this.activityRepository.create(createActivityDto);
    return await this.activityRepository.save(newActivity);
  }

  async findAll(): Promise<Activity[]> {
    return await this.activityRepository.find();
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id: id },
      relations: ['addBy', 'type', 'asset'],
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }
  async findOpenJoin(): Promise<Activity[]> {
    const activitys = await this.activityRepository
      .createQueryBuilder('ac')
      .innerJoinAndSelect('ac.addBy', 'user')
      .innerJoinAndSelect('ac.type', 'ActivityType')
      .leftJoinAndSelect('ac.asset', 'asset')
      .where('ac.is_open_join = true')
      .andWhere(`ac.dateTimeStart >= CURRENT_DATE()`)
      .orderBy('ac.type', 'DESC')
      .addOrderBy('ac.dateTimeCreated', 'DESC')
      .getMany();

    for (const activity of activitys) {
      if (activity.type.id == 2) {
        activity.addBy.first_name = 'ชมรม';
        activity.addBy.last_name = 'ยอดหญ้าบนภูสูง';
      }
    }
    return activitys;
  }

  async findClub() {
    const activitys = await this.activityRepository
      .createQueryBuilder('ac')
      .innerJoinAndSelect('ac.addBy', 'user')
      .innerJoinAndSelect('ac.type', 'ActivityType')
      .leftJoinAndSelect('ac.asset', 'asset')
      .where(`ac.is_open_join = true AND ac.type = 2`)
      .orderBy('ac.type', 'DESC')
      .addOrderBy('ac.dateTimeCreated', 'DESC')
      .getMany();
    return activitys;
  }
  async findAcvitiyClubByYear(year: string): Promise<Activity[]> {
    const activity = await this.activityRepository
      .createQueryBuilder('ac')
      .where('type = 2 AND YEAR(ac.dateTimeStart) = :year', { year: year })
      .getMany();
    return activity;
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id);
    if (!activity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    if (updateActivityDto.dateTimeEnd == updateActivityDto.dateTimeStart) {
      updateActivityDto.dateTimeEnd = null;
    }
    this.activityRepository.merge(activity, updateActivityDto);
    return await this.activityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    await this.activityRepository.delete(id);
  }
}
