import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity'; // Import the User entity

@Entity({
  name: 'role',
})
export class Role {
  @ApiProperty({
    description: 'ID of role',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of role', example: 'user' })
  @Column()
  nameRole: string;

  @ApiProperty({
    description: 'Users with this role',
    type: () => User,
    isArray: true,
  })
  @OneToMany(() => User, (user) => user.roleId)
  users: User[];

  // Other fields or methods can be added as needed

  // Note: If you have a specific naming strategy, you might need to adjust
  // the column names and their casing based on your configuration.
}
