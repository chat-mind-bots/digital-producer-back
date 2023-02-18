import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChangeCourseModuleDto {
  @ApiProperty({
    example: 'Module name',
    description: 'Module name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 1,
    description: 'Number of lesson',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly logic_number?: number;
}
