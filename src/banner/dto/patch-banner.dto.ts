import { ApiProperty } from '@nestjs/swagger';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class PatchBannerDto {
  @ApiProperty({
    example: 'Banner about IT',
    description: 'Banner title',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

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
  @IsOptional()
  readonly type?: BannerTypeEnum;

  @ApiProperty({
    example: 'https://www.google.com/',
    description: 'url for button',
    required: true,
  })
  @IsUrl()
  @IsOptional()
  readonly url_button?: string;

  @ApiProperty({
    example: 'https://www.google.com',
    description: 'Url to another source',
    required: false,
  })
  @IsUrl()
  readonly third_party_source?: string;

  @ApiProperty({
    example: 'Go to page',
    description: 'text for banner',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly text_button?: string;

  @ApiProperty({
    example: '{border-color: 1px solid red}',
    description: 'styles for banner',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly style_button?: string;

  @ApiProperty({
    example: 'Banner name',
    description: 'Banner name',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    example: 'Smth... about banner',
    description: 'Description for button',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

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
  @IsOptional()
  readonly role?: UserRoleEnum;

  @ApiProperty({
    example: 'https://www.google.com/image.png',
    description: 'Image url',
    required: true,
  })
  @IsUrl()
  @IsOptional()
  readonly image?: string;

  @ApiProperty({
    required: true,
    type: () => [CreateTagDto],
  })
  @IsArray()
  // @Type(() => CreateTagDto)
  @Type(() => CreateTagDto)
  @ValidateNested({ each: true })
  @IsOptional()
  readonly tags?: CreateTagDto[];
}
