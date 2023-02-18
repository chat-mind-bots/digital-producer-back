import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ChangeDocumentDto {
  @ApiProperty({
    example: 'Document about IT',
    description: 'Document name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://www.google.com/',
    description: 'url',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly url: string;

  @ApiProperty({
    example: 'Document description',
    description: 'Document description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description: string;
}
