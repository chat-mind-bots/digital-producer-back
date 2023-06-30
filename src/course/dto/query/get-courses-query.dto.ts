import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';
import { Transform } from 'class-transformer';
import {
  toBoolean,
  toLowerCase,
  toNumber,
  trim,
} from 'src/common/helpers/query.helper';
import { CurseSortByEnum } from 'src/course/enum/curse-sort-by.enum';
import { CurseStatusEnum } from 'src/course/enum/curse-status.enum';

export class GetCoursesQueryDto {
  @ApiProperty({
    example: ['83f...', 'c32...', '9a7...'],
    description: 'Array of sub-categories ids',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly 'sub-category-id'?: string[];

  @ApiProperty({
    example: ['83f...', 'c32...', '9a7...'],
    description: 'Array of owner ids',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly 'owner-id'?: string[];

  @ApiProperty({
    example: ['83f...', 'c32...', '9a7...'],
    description: 'Array of enrolled user ids',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly 'enrolled-user-id'?: string[];

  @ApiProperty({
    example: 5,
    description: 'limit',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 5, min: 1, max: 15 }))
  @IsNumber()
  readonly limit: number;

  @ApiProperty({
    example: 0,
    description: 'offset',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  readonly offset: number;

  @Transform(({ value }) => trim(toLowerCase(value)))
  @ApiProperty({
    example: 'Course about IT',
    description: 'Course name',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly q?: string;

  @ApiProperty({
    example: CurseSortByEnum.BY_DATE,
    description: 'Sort by',
    enum: CurseSortByEnum,
    required: false,
    type: String,
  })
  @IsString()
  @IsEnum(CurseSortByEnum)
  @IsOptional()
  readonly 'sort-by'?: CurseSortByEnum;

  @Transform(({ value }) => trim(toLowerCase(value)))
  @ApiProperty({
    example: 'asc',
    description: 'Sort order. Values asc or desc only',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly 'sort-order'?: 'asc' | 'desc';

  @ApiProperty({
    example: CurseStatusEnum.IN_REVIEW,
    description: 'Course status',
    enum: CurseStatusEnum,
    required: false,
    type: String,
  })
  @IsString()
  @IsEnum(CurseStatusEnum)
  @IsOptional()
  readonly status?: CurseStatusEnum;

  @Transform(({ value }) => toBoolean(value))
  @ApiProperty({
    example: 'true',
    description: 'hide bought courses',
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  readonly 'hide-bought'?: boolean;
}
