import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Answer, IAnswer } from 'src/test/test.schema';

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
    example: 'Test question',
    description: 'Test question',
    required: true,
  })
  @IsString()
  readonly question: string;

  @ApiProperty({
    example: [
      {
        key: 'answer_1',
        value: 'Some text for answer',
      },
    ],
    description: 'answers array',
    required: true,
    type: Answer,
  })
  @IsArray()
  readonly answers: [IAnswer];

  @ApiProperty({
    example: 'answer_1',
    description: 'Right answer key',
    required: false,
  })
  @IsOptional()
  @IsString()
  right_answer?: string;

  @ApiProperty({
    example: ['answer_1', 'answer_2'],
    description: 'Right answers key in  array',
    required: false,
  })
  @IsOptional()
  @IsArray()
  right_answers?: [string];

  @ApiProperty({
    example: true,
    description: 'The question  is multiply?',
    required: true,
  })
  @IsBoolean()
  is_multiply: boolean;
}
