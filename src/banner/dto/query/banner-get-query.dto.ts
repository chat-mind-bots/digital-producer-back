import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'src/common/helpers/query.helper';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class BannerGetQueryDto {
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
    example: BannerTypeEnum.SLIDER,
    description: 'Banner type',
    required: false,
    enum: BannerTypeEnum,
    type: String,
  })
  @IsString()
  @IsEnum(BannerTypeEnum)
  @IsOptional()
  readonly type?: BannerTypeEnum;

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
}
