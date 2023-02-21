import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';

export class CreateCourseLessonDto {
  @ApiProperty({
    example: 'Lesson name',
    description: 'Lesson name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Lesson description',
    description: 'Lesson description',
    required: true,
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to lesson image',
    required: true,
  })
  @IsUrl()
  readonly image: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to lesson video',
    required: true,
  })
  @IsUrl()
  readonly video: string;

  @ApiProperty({
    example: +CourseLevelDifficultlyEnum.MEDIUM,
    description: 'Difficultly level',
    enum: CourseLevelDifficultlyEnum,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsEnum(CourseLevelDifficultlyEnum)
  readonly level_difficulty: number;

  @ApiProperty({
    example: 1,
    description: 'Number of lesson',
    required: true,
  })
  @IsNumber()
  readonly logic_number: number;

  @ApiProperty({
    example: 1,
    description: 'Number of points for tests to pass lesson',
    required: true,
  })
  @IsNumber()
  readonly number_of_points_to_pass: number;
}
