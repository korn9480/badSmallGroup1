import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from './activity.entity'; // Import Activity entity

@Entity({
  name: 'activity_type',
})
export class ActivityType {
  @ApiProperty({
    description: 'ID of activity type',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the activity type', example: 'Seminar' })
  @Column({ name: 'name_type' })
  nameType: string;

  @OneToMany(() => Activity, (activity) => activity.type)
  activities: Activity[];

  // You can add more properties or relationships as needed.

  // No need for @UpdateDateColumn in this example since it's a static list.

  // Optionally, you can add constructor and other methods if needed.
}
