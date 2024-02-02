import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { DeepPartial } from 'typeorm';
// import { AllergyType } from '../entities/allergy.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateAllergyDto {
  // @ApiProperty({ description: 'Type of allergy', example: 1 })
  // @IsNotEmpty()
  // @IsInt()
  // // type: DeepPartial<AllergyType>

  @IsNotEmpty()
  @IsInt()
  code_student: DeepPartial<User>;

  @ApiProperty({ description: 'Name of allergy', example: 'Peanuts' })
  @IsNotEmpty()
  @IsString()
  allergy: string;

  // @ApiProperty({ description: 'Reactions to the allergy', example: 'Skin rash' })
  // @IsNotEmpty()
  // @IsString()
  // reactions: string;

  // @ApiProperty({ description: 'Treatment for the allergy', example: 'Antihistamines' })
  // @IsNotEmpty()
  // @IsString()
  // treatment: string;
}
