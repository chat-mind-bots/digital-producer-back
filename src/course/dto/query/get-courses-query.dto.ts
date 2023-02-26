import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';
import { Transform } from 'class-transformer';
import { toLowerCase, toNumber, trim } from 'src/common/helpers/query.helper';

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
}
