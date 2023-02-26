import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class CreateTestDto {
  @ApiProperty({
    example: 'Test name',
    description: 'Test name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Test description',
    description: 'Test description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 100000,
    description: 'Test duration in ms',
    required: true,
  })
  @IsNumber()
  readonly duration: number;

  @ApiProperty({
    example: '83f...',
    description: 'Lesson id',
    required: true,
  })
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly lesson_id: string;
}
