import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({
    example: 'Course category about IT',
    description: 'course title',
    required: true,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: '#FFFF',
    description: 'course tags color',
    required: true,
  })
  @IsString()
  readonly tags_color: string;
}
