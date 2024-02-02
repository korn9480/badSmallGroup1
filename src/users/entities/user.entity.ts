import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity'; // Import the Role entity

@Entity({
  name: 'user',
})
export class User {
  @ApiProperty({
    description: 'Code of the student',
    example: '60000000',
  })
  @PrimaryColumn()
  code_student: string;

  @ApiProperty({ description: 'Profile of user', example: null })
  @Column({ nullable: true })
  profile: string;

  @ApiProperty({ description: 'Password of user' })
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ description: 'prefix of user0', example: 'นาย' })
  @Column({ default: 'นาย' })
  prefix: string;

  @ApiProperty({ description: 'First name of user', example: 'ทดสอบสอง' })
  @Column()
  first_name: string;

  @ApiProperty({ description: 'Last name of user', example: 'ทดสอบสอง' })
  @Column()
  last_name: string;

  @ApiProperty({ description: 'Nick name of user', example: 'ทดสอบสอง' })
  @Column()
  nick_name: string;

  @ApiProperty({
    description: 'Faculty of user',
    example: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร',
  })
  @Column()
  faculty: string;

  @ApiProperty({
    description: 'Major of user',
    example: 'สาขาวิศวกรรมคอมพิวเตอร์',
  })
  @Column()
  major: string;

  @ApiProperty({ description: 'Phone number of user', example: '0885591425' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Religion of user', example: 'พุทธ' })
  @Column()
  religion: string;

  @ApiProperty({ description: 'Blood group of user', example: 'o' })
  @Column()
  blood_group: string;

  @ApiProperty({
    description: 'Role ID of user',
    example: 1,
  })
  @ManyToOne(() => Role, { eager: true, nullable: false }) // Many-to-One relationship with Role entity
  @JoinColumn({ name: 'roleId' })
  roleId: DeepPartial<Role>;

  @ApiProperty({ description: 'Created date of user' })
  @CreateDateColumn({ name: 'date_time_created' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @UpdateDateColumn({ name: 'date_time_updated' })
  updatedAt: Date;
}
