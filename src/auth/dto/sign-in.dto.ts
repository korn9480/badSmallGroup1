import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email of user',
    example: '64021700',
  })
  @Length(8)
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
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  @IsNotEmpty()
  readonly password: string;
}
