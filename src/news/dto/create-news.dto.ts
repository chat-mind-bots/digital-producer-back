import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { Type } from 'class-transformer';

export class CreateNewsDto {
  @ApiProperty({
    example: 'Something name',
    description: 'News list object name',
    required: true,
  })
  @IsString()
  readonly category_id: string;

  @ApiProperty({
    example: 'Something name',
    description: 'News list object name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Something description',
    description: 'News list object description',
    required: true,
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: '111',
    description: 'Time reade of news in ms',
    required: true,
  })
  @IsNumber()
  readonly time_read: number;

  @ApiProperty({
    example: Date.now(),
    description: 'Date of news',
    required: true,
  })
  @IsNumber()
  readonly date: Date;

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
