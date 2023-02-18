import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangeCourseSubCategoryDto {
  @ApiProperty({
    example: 'Course sub-category about IT',
    description: 'course sub-course title',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: '#FFFF',
    description: 'course sub-category tags color',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly tags_color?: string;

  @ApiProperty({
    example: '84fff..',
    description: 'course category id',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly category_id?: string;
}
