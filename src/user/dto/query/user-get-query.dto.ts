import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'src/common/helpers/query.helper';
import { ApiProperty } from '@nestjs/swagger';

export class UserGetQueryDto {
  @ApiProperty({
    example: 5,
    description: 'limit',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 5, min: 1, max: 50 }))
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

  @ApiProperty({
    example: 'John',
    description: 'username or first_name',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly q?: string;
}
