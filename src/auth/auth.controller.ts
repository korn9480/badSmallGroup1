import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AllergyService } from 'src/allergy/allergy.service';
import { CreateAllergyDto } from 'src/allergy/dto/create-allergy.dto';
import { REQUEST_USER_KEY } from 'src/common/constants';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Owner, OwnerAuthGuard, OwnerTable } from './guards/owner-auth.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly allergyService: AllergyService,
  ) {}

  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign up fields',
  })
  @ApiCreatedResponse({
    description: 'User has been successfully signed up',
  })
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpDto);
    console.log(signUpDto);
    if (signUpDto.allergics.length > 0) {
      for (const at of signUpDto.allergics) {
        await this.allergyService.create(at);
      }
    }
  }

  @ApiConflictResponse({
    description: 'User not have in system',
  })
  @ApiBadRequestResponse({
    description: 'Return errors for invalid update user fields',
  })
  @ApiCreatedResponse({
    description: 'User has been successfully update user',
  })
  @OwnerTable(Owner.asset)
  @UseGuards(OwnerAuthGuard)
  @Put()
  async updateUser(@Body() signUpDto: UpdateAuthDto): Promise<void> {
    await this.authService.update(signUpDto);
    if (signUpDto.allergics.length > 0) {
      for (const at of signUpDto.allergics) {
        await this.allergyService.create(at);
      }
    }
  }

  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign in fields',
  })
  @ApiOkResponse({ description: 'User has been successfully signed in' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Request() request) {
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    return await this.authService.refreshToken(user);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'User has been successfully signed out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@ActiveUser('code_student') userId: string): Promise<void> {
    return this.authService.signOut(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'User has been successfully signed out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('forgot-password')
  async forGotPassword(@Body() form: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(form);
  }
}
