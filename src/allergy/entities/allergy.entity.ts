// allergy.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('allergy')
// @Unique(['type']) // Ensures uniqueness of 'type' column
export class Allergy {
  @ApiProperty({ description: 'ID of allergy' })
  @PrimaryGeneratedColumn()
  id: number;

  // @ApiProperty({ description: 'Type of allergy', example: 'food' })
  // @ManyToOne(()=>AllergyType,at=>at.id)
  // @JoinColumn()
  // type: DeepPartial<AllergyType>;

  @ApiProperty({ description: 'student of allergy', example: '600000' })
  @ManyToOne(() => User, (u) => u.code_student)
  @JoinColumn({ name: 'code_student' })
  code_student: DeepPartial<User>;

  @ApiProperty({ description: 'Name of allergy', example: 'Peanuts' })
  @Column({ length: 255 })
  allergy: string;

  // @ApiProperty({ description: 'Reactions to the allergy', example: 'Skin rash' })
  // @Column({ length: 255 })
  // reactions: string;

  // @ApiProperty({ description: 'Treatment for the allergy', example: 'Antihistamines' })
  // @Column({ length: 255 })
  // treatment: string;

  // ... other fields

  // Relationships and foreign keys can be added here
}
