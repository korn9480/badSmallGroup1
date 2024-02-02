import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email of user',
    example: '64021700',
  })
  @MaxLength(8)
  @IsNotEmpty()
  readonly code_student: string;

  @ApiProperty({
    description: 'Password of user',
    example: '12345678',
  })
  @MinLength(8, {
    message: 'password too short',
  })
  @MaxLength(20, {
    message: 'password too long',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  readonly password: string;

  @Match('password')
  @IsNotEmpty()
  readonly confirm_password: string;
}
