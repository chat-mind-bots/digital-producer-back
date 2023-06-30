import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { toNumber } from 'src/common/helpers/query.helper';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class NewsListGetQueryDto {
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
    example: UserRoleEnum.USER,
    description: 'user role',
    required: false,
    type: String,
    enum: UserRoleEnum,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  @IsOptional()
  readonly role?: UserRoleEnum;

  @ApiProperty({
    example: '8g3...',
    description: 'News categoty id',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly 'category-id': string;
}
