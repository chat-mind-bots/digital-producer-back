import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';

export class ChangeCourseLessonDto {
  @ApiProperty({
    example: 'Lesson name',
    description: 'Lesson name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Lesson description',
    description: 'Lesson description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to lesson image',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly image?: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to lesson video',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly video?: string;

  @ApiProperty({
    example: +CourseLevelDifficultlyEnum.MEDIUM,
    description: 'Difficultly level',
    enum: CourseLevelDifficultlyEnum,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsEnum(CourseLevelDifficultlyEnum)
  readonly level_difficulty?: number;

  @ApiProperty({
    example: 1,
    description: 'Number of lesson',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly logic_number?: number;
}
