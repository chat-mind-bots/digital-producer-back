import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from 'src/common/helpers/query.helper';

export class GetCourseQueryDto {
  @ApiProperty({
    example: 5,
    description: 'students limit',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 5, min: 1, max: 15 }))
  @IsNumber()
  readonly 'students-limit'?: number;

  @ApiProperty({
    example: 0,
    description: 'students offset',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  readonly 'students-offset': number;
}
