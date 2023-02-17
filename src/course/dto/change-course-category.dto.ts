import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangeCourseCategoryDto {
  @ApiProperty({
    example: 'Course category about IT',
    description: 'course title',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: '#FFFF',
    description: 'course tags color',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly tags_color?: string;
}
