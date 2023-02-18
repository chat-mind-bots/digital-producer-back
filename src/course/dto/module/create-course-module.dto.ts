import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCourseModuleDto {
  @ApiProperty({
    example: 'Module name',
    description: 'Module name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 1,
    description: 'Number of lesson',
    required: true,
  })
  @IsNumber()
  readonly logic_number: number;
}
