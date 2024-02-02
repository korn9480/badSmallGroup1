import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Matches,
  isInt,
} from 'class-validator';
import { CreateAllergyDto } from 'src/allergy/dto/create-allergy.dto';
import { Match } from 'src/common/decorators/match.decorator';
import { Role } from 'src/users/entities/role.entity';
import { DeepPartial } from 'typeorm';

const text_error = 'format is incorrect';
export class SignUpDto {
  @ApiProperty({
    description: 'Code of the student',
    example: '64021708',
  })
  @IsNotEmpty()
  @IsString()
  readonly code_student: string;

  @ApiProperty({
    description: 'Profile image path',
    example: '/path/to/profile.jpg',
  })
  readonly profile: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/, {
    message: 'password too weak',
  })
  password: string;

  @Match('password')
  @IsNotEmpty()
  readonly confirm_password: string;

  // @ApiProperty({ description: 'First name of the user', example: 'ทินกร' })
  // @IsNotEmpty()
  // @IsString()
  // @Matches(/^[\u0E00-\u0E7F]+$/,{message:'prefix '+text_error})
  prefix: string;

  @ApiProperty({ description: 'First name of the user', example: 'ทินกร' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(นาย|นางสาว)[\u0E00-\u0E7F]+$/, {
    message: 'first name ' + text_error,
  })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'แซ่เล้า' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\u0E00-\u0E7F]+$/, { message: 'last name ' + text_error })
  readonly last_name: string;

  @ApiProperty({ description: 'Nickname of the user', example: 'Korn' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\u0E00-\u0E7F]+$/, { message: 'nick name ' + text_error })
  readonly nick_name: string;

  @ApiProperty({
    description: 'Faculty of the user',
    example: 'Information Technology and Communication',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\u0E00-\u0E7F]+$/, { message: 'faculty ' + text_error })
  readonly faculty: string;

  @ApiProperty({
    description: 'Major of the user',
    example: 'Software Engineering',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\u0E00-\u0E7F]+$/, { message: 'major ' + text_error })
  readonly major: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0885591425',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0][0-9]{9}$/, { message: 'last name ' + text_error })
  readonly phone: string;

  @ApiProperty({ description: 'Religion of the user', example: 'Buddhist' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\u0E00-\u0E7F]+$/, { message: 'religion ' + text_error })
  readonly religion: string;

  @ApiProperty({ description: 'Blood group of the user', example: 'AB' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[^\u0E00-\u0E7F0-9]+$/, { message: 'blood group ' + text_error })
  readonly blood_group: string;

  @ApiProperty({ description: 'Name of allergy', example: '' })
  @IsArray()
  allergics: CreateAllergyDto[];

  @ApiProperty({ description: 'Role ID of the user', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly roleId: DeepPartial<Role>;
}
