import { ApiProperty } from '@nestjs/swagger';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class CreateBannerDto {
  @ApiProperty({
    example: 'Banner about IT',
    description: 'Banner title',
    required: true,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: BannerTypeEnum.SLIDER,
    description: 'Banner type',
    required: true,
    enum: BannerTypeEnum,
    examples: [
      BannerTypeEnum.LEFT,
      BannerTypeEnum.TOP,
      BannerTypeEnum.RIGHT,
      BannerTypeEnum.SLIDER,
    ],
    type: String,
  })
  @IsString()
  @IsEnum(BannerTypeEnum)
  readonly type: BannerTypeEnum;

  @ApiProperty({
    example: 'https://www.google.com/',
    description: 'url for button',
    required: true,
  })
  @IsUrl()
  readonly url_button: string;

  @ApiProperty({
    example: 'Go to page',
    description: 'text for banner',
    required: true,
  })
  @IsString()
  readonly text_button: string;

  @ApiProperty({
    example: '{border-color: 1px solid red}',
    description: 'styles for banner',
    required: true,
  })
  @IsString()
  readonly style_button: string;

  @ApiProperty({
    example: 'Banner name',
    description: 'Banner name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Smth... about banner',
    description: 'Description for button',
    required: true,
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: true,
    description: 'is third  party source link?',
    required: false,
  })
  @IsBoolean()
  readonly is_third_party_source: boolean;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'User role who can see banner',
    required: true,
    enum: UserRoleEnum,
    examples: [UserRoleEnum.USER, UserRoleEnum.PRODUCER],
    type: String,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  readonly role: UserRoleEnum;

  @ApiProperty({
    example: 'https://www.google.com/image.png',
    description: 'Image url',
    required: true,
  })
  @IsUrl()
  readonly image: string;

  @ApiProperty({
    required: true,
    type: () => [CreateTagDto],
  })
  @IsArray()
  // @Type(() => CreateTagDto)
  @Type(() => CreateTagDto)
  @ValidateNested({ each: true })
  readonly tags!: CreateTagDto[];
}
