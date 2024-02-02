import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ActivityService } from 'src/activity/activity.service';
import { Public } from 'src/common/decorators/public.decorator';
import {
  Owner,
  OwnerAuthGuard,
  OwnerTable,
} from 'src/auth/guards/owner-auth.guard';

@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly activityService: ActivityService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('path', 6, {
      storage: diskStorage({
        destination: './images/poster',
        filename: (req, file, cd) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cd(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async create(
    @Body('type') typeId: string,
    @Body('activityId') acivityId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log('upload asset');
      const activity = await this.activityService.findOne(+acivityId);
      const type = await this.assetService.findType(+typeId);
      const i = 0;
      for (const file of files) {
        let path = file.path;
        path = path.replace('\\', '/');
        path = path.replace('\\', '/');
        await this.assetService.create(type, activity, path);
      }
      return { status: 'ok' };
    } catch (error) {
      throw new InternalServerErrorException('File upload failed');
    }
  }
  @Public()
  @Get('images/poster/:path')
  async streamFile(
    @Res() res: Response,
    @Param('path') path: string,
  ): Promise<void> {
    const filePath = `images/poster/${path}`; // แก้ไขเป็นที่อยู่ของไฟล์ที่คุณต้องการสตรีม
    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    this.assetService.streamFile(res, filePath);
  }
  @Public()
  @Get('images/profile/:path')
  async streamFileProfile(
    @Res() res: Response,
    @Param('path') path: string,
  ): Promise<void> {
    const filePath = `images/profile/${path}`; // แก้ไขเป็นที่อยู่ของไฟล์ที่คุณต้องการสตรีม
    this.assetService.streamFile(res, filePath);
  }

  @Get()
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(+id);
  }

  @OwnerTable(Owner.asset)
  @UseGuards(OwnerAuthGuard)
  @Delete(':id_activity/:id_asset')
  remove(@Param('id_asset') id: string) {
    return this.assetService.remove(+id);
  }
}
