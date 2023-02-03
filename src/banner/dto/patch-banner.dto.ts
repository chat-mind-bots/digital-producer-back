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
  readonly urlButton?: string;

  @ApiProperty({
    example: 'Go to page',
    description: 'text for banner',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly textButton?: string;

  @ApiProperty({
    example: '{border-color: 1px solid red}',
    description: 'styles for banner',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly styleButton?: string;

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
    example: 'USER',
    description: 'role visible',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly role?: string;

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
