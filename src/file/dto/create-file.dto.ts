import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  e_tag: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  location: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  key: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  bucket: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  url: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  domain: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  file_size: number;
}
