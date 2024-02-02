import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { REQUEST_USER_KEY } from 'src/common/constants';
import { AssetService } from 'src/asset/asset.service';
import {
  Owner,
  OwnerAuthGuard,
  OwnerTable,
} from 'src/auth/guards/owner-auth.guard';
import { JoinActivityDto } from './dto/join-activity.dto';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly assetService: AssetService,
  ) {}

  @Post()
  async create(@Body() createActivityDto: CreateActivityDto) {
    return await this.activityService.create(createActivityDto);
  }

  @Post('join/:idActivity')
  async joinActivity(
    @Body() form: JoinActivityDto,
    @Param('idActivity') idActivity: number,
  ) {
    console.log(form);
    return await this.activityService.joinActivity(form, idActivity);
  }
  @Post('cancel')
  async cancelActivity(@Body() form: JoinActivityDto) {
    await this.activityService.cancelActivity(form);
  }

  @Get('perplo_join/:idActivity')
  async perplo_join(
    @Param('idActivity') idActivity: number,
    @Request() request,
  ) {
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    return await this.activityService.findPerploJoin(
      idActivity,
      user.code_student,
    );
  }

  @Get()
  findAll() {
    return this.activityService.findAll();
  }
  @Get('open_join')
  async findOpenJoin() {
    return await this.activityService.findOpenJoin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Get('club/:year')
  async findActivityClubByYear(@Param('year') year: string) {
    return await this.activityService.findAcvitiyClubByYear(year);
  }

  @OwnerTable(Owner.activity)
  @UseGuards(OwnerAuthGuard)
  @Put(':id_activity')
  async update(
    @Param('id_activity') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return await this.activityService.update(+id, updateActivityDto);
  }

  @OwnerTable(Owner.activity)
  @UseGuards(OwnerAuthGuard)
  @Delete(':id_activity')
  async remove(@Param('id_activity') id: string) {
    const activity = await this.activityService.findOne(+id);
    if (!activity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    const assetAll = await this.assetService.findAllByActivityId(+id);
    for (const asset of assetAll) {
      await this.assetService.remove(asset.id);
    }
    return this.activityService.remove(+id);
  }
}
