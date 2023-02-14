import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { Type } from 'class-transformer';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class CreateNewsDto {
  @ApiProperty({
    example: 'Something name',
    description: 'News list object name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'User role who can see type',
    required: true,
    enum: UserRoleEnum,
    examples: [UserRoleEnum.USER, UserRoleEnum.PRODUCER],
    type: String,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  readonly role: UserRoleEnum;

  @ApiProperty({
    example: 'Something description',
    description: 'News list object description',
    required: true,
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: '111',
    description: 'Time reade of type in ms',
    required: true,
  })
  @IsNumber()
  readonly time_read: number;

  @ApiProperty({
    example: '84fff..',
    description: 'News category id',
    required: true,
  })
  @IsString()
  readonly category_id: string;

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
