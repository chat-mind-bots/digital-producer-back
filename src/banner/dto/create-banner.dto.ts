import { ApiProperty } from '@nestjs/swagger';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type, serialize } from 'class-transformer';

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
  readonly urlButton: string;

  @ApiProperty({
    example: 'Go to page',
    description: 'text for banner',
    required: true,
  })
  @IsString()
  readonly textButton: string;

  @ApiProperty({
    example: '{border-color: 1px solid red}',
    description: 'styles for banner',
    required: true,
  })
  @IsString()
  readonly styleButton: string;

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
    example: 'USER',
    description: 'role visible',
    required: true,
  })
  @IsString()
  readonly role: string;

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
  // @IsDefined()
  // @IsNotEmptyObject()
  // @IsObject()
  @IsArray()
  // @Type(() => CreateTagDto)
  @Type(() => CreateTagDto)
  @ValidateNested({ each: true })
  readonly tags!: CreateTagDto[];
}
export function serializeModel<T>(object: T) {
  return function () {
    return object;
  };
}
