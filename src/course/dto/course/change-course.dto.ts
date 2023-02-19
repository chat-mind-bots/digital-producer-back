import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';
import {
  ICourseNote,
  ICoursePrice,
  Note,
  Price,
} from 'src/course/schemas/course.schema';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { Type } from 'class-transformer';

export class ChangeCourseDto {
  @ApiProperty({
    example: 'Course name',
    description: 'Course name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Course description',
    description: 'Course description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to course image',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly image?: string;

  @ApiProperty({
    example: 'https://www.goohle.com',
    description: 'Url to course video',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly video?: string;

  @ApiProperty({
    example: false,
    description: 'Course is free or not?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  @ApiProperty({
    example: 'Course language',
    description: 'Course language',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly language?: string;

  @ApiProperty({
    example: {
      actual: 999,
      discount: 1,
    },
    description: 'user role',
    required: false,
    type: Price,
  })
  @IsOptional()
  @IsObject()
  readonly price?: ICoursePrice;

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
    required: false,
    type: () => [CreateTagDto],
  })
  @IsOptional()
  @IsArray()
  // @Type(() => CreateTagDto)
  @Type(() => CreateTagDto)
  @ValidateNested({ each: true })
  readonly tags?: CreateTagDto[];

  @ApiProperty({
    example: [
      {
        name: 'Note name',
        value: 'Note value',
      },
    ],
    description: 'user role',
    required: false,
    type: Note,
  })
  @IsOptional()
  @IsArray()
  readonly notes?: [ICourseNote];
}
