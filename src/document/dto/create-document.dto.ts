import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    example: 'Document about IT',
    description: 'Document name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://www.google.com/',
    description: 'url',
    required: true,
  })
  @IsUrl()
  readonly url: string;

  @ApiProperty({
    example: 'Document description',
    description: 'Document description',
    required: true,
  })
  @IsString()
  readonly description: string;
}
