import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/common/constants';
import {
  Owner,
  OwnerAuthGuard,
  OwnerTable,
} from 'src/auth/guards/owner-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: "Get logged in user's details", type: User })
  @ApiBearerAuth()
  @Get('me')
  async getMe(@ActiveUser('code_student') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @OwnerTable(Owner.asset)
  @UseGuards(OwnerAuthGuard)
  @Post('profile/:code_student')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './images/profile',
        filename: (req, file: Express.Multer.File, cd) => {
          const user: ActiveUserData = req[REQUEST_USER_KEY];
          const type = file.originalname.split('.'); // kon jpg
          const i = type.length;
          cd(null, `${user.code_student}.${type[i - 1]}`);
        },
      }),
    }),
  )
  async uploadProfile(
    @Param('code_student') codeStudent: string,
    @UploadedFile() files: Express.Multer.File,
  ) {
    if (!files) {
      return;
    }
    let path = files.path;
    path = path.replace('\\', '/');
    path = path.replace('\\', '/');
    await this.usersService.uploadFile(path, codeStudent);
  }

  @Get('profile/:code_student')
  async getProfile(@Param('code_student') code_student: string) {
    return await this.usersService.findOne(code_student);
  }
}
