import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseSubCategoryDto {
  @ApiProperty({
    example: 'Course sub-category about IT',
    description: 'course sub-course title',
    required: true,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: '#FFFF',
    description: 'course sub-category tags color',
    required: true,
  })
  @IsString()
  readonly tags_color: string;

  @ApiProperty({
    example: '84fff..',
    description: 'course category id',
    required: true,
  })
  @IsString()
  readonly category_id: string;
}
